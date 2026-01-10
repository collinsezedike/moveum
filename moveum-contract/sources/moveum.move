module moveum::gallery {
    use std::error;
    use std::signer;
    use std::string::{String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};

    // Constants
    const SEED: vector<u8> = b"moveum_gallery";
    const MINT_FEE: u64 = 1000000; // 0.01 APT

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ARTIFACT_NOT_FOUND: u64 = 2;
    const E_ARTIFACT_ALREADY_EXISTS: u64 = 5;
    const E_INSUFFICIENT_FUNDS: u64 = 6;

    struct Artifact has store {
        id: String,
        title: String,
        year: u64,
        description: String,
        image_url: String,
        created_at: u64,
        artist: address,
    }

    struct GalleryState has key {
        admin: address,
        collection: Table<String, Artifact>,
        artifact_ids: vector<String>,
        upload_events: EventHandle<ArtifactUploadEvent>,
    }

    struct ResourceAccountCap has key {
        signer_cap: account::SignerCapability
    }

    #[event]
    struct ArtifactUploadEvent has drop, store {
        id: String,
        title: String,
        artist: address,
        created_at: u64
    }

    fun init_module(admin: &signer) {
        initialize_internal(admin);
    }

    public fun initialize_internal(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        let (resource_signer, signer_cap) = account::create_resource_account(admin, SEED);
        let resource_addr = signer::address_of(&resource_signer);

        if (!coin::is_account_registered<AptosCoin>(resource_addr)) {
            coin::register<AptosCoin>(&resource_signer);
        };

        move_to(&resource_signer, GalleryState {
            admin: admin_addr,
            collection: table::new(),
            artifact_ids: vector::empty<String>(),
            upload_events: account::new_event_handle<ArtifactUploadEvent>(&resource_signer),
        });

        move_to(admin, ResourceAccountCap { signer_cap });
    }

    public entry fun upload_artifact(
        user: &signer,
        id: String,
        title: String,
        year: u64,
        description: String,
        image_url: String
    ) acquires GalleryState, ResourceAccountCap {
        let user_addr = signer::address_of(user);
        let state = borrow_global_mut<GalleryState>(get_resource_address());

        assert!(!table::contains(&state.collection, id), error::already_exists(E_ARTIFACT_ALREADY_EXISTS));
        
        let payment = coin::withdraw<AptosCoin>(user, MINT_FEE);
        coin::deposit<AptosCoin>(get_resource_address(), payment);

        let artifact = Artifact {
            id,
            title,
            year,
            description,
            image_url,
            created_at: timestamp::now_seconds(),
            artist: user_addr,
        };

        table::add(&mut state.collection, id, artifact);
        vector::push_back(&mut state.artifact_ids, id);

        event::emit_event(&mut state.upload_events, ArtifactUploadEvent {
            id, title, artist: user_addr, created_at: timestamp::now_seconds()
        });
    }

    fun get_resource_address(): address acquires ResourceAccountCap {
        let cap = borrow_global<ResourceAccountCap>(@moveum);
        account::get_signer_capability_address(&cap.signer_cap)
    }

    #[view]
    public fun get_all_artifact_ids(): vector<String> acquires GalleryState, ResourceAccountCap {
        let state = borrow_global<GalleryState>(get_resource_address());
        state.artifact_ids
    }

    #[view]
    public fun get_artifact_details(id: String): (String, u64, String, String, address) acquires GalleryState, ResourceAccountCap {
        let state = borrow_global<GalleryState>(get_resource_address());
        let artifact = table::borrow(&state.collection, id);
        (artifact.title, artifact.year, artifact.description, artifact.image_url, artifact.artist)
    }
}