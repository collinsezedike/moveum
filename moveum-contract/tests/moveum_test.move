#[test_only]
module moveum::gallery_tests {
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use moveum::gallery;

    #[test(admin = @moveum, user = @0x123, aptos_framework = @0x1)]
    fun test_upload_flow(
        admin: &signer, 
        user: &signer, 
        aptos_framework: &signer
    ) {
        timestamp::set_time_has_started_for_testing(aptos_framework);
        
        let user_addr = signer::address_of(user);
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        account::create_account_for_test(user_addr);
        coin::register<AptosCoin>(user);
        let coins = coin::mint<AptosCoin>(100000000, &mint_cap); 
        coin::deposit(user_addr, coins);

        gallery::initialize_internal(admin);

        let id = string::utf8(b"Mona_Lisa_001");
        gallery::upload_artifact(
            user,
            id,
            string::utf8(b"Mona Lisa"),
            1503,
            string::utf8(b"Portrait of a woman by Leonardo da Vinci"),
            string::utf8(b"https://example.com/mona_lisa.jpg")
        );

        // Assertions
        let all_ids = gallery::get_all_artifact_ids();
        assert!(vector::length(&all_ids) == 1, 101);
        assert!(*vector::borrow(&all_ids, 0) == id, 102);

        let (title, year, _, _, artist) = gallery::get_artifact_details(id);
        assert!(title == string::utf8(b"Mona Lisa"), 103);
        assert!(year == 1503, 104);
        assert!(artist == user_addr, 105);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(admin = @moveum, user = @0x123, aptos_framework = @0x1)]
    #[expected_failure(abort_code = 0x80005, location = moveum::gallery)]
    fun test_duplicate_id_fails(
        admin: &signer, 
        user: &signer, 
        aptos_framework: &signer
    ) {
        timestamp::set_time_has_started_for_testing(aptos_framework);
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        account::create_account_for_test(signer::address_of(user));
        coin::register<AptosCoin>(user);
        coin::deposit(signer::address_of(user), coin::mint<AptosCoin>(100000000, &mint_cap));

        gallery::initialize_internal(admin);

        let id = string::utf8(b"DUP_ID");
        gallery::upload_artifact(user, id, string::utf8(b"T1"), 2024, string::utf8(b"D1"), string::utf8(b"U1"));
        
        // This second call should trigger E_ARTIFACT_ALREADY_EXISTS
        gallery::upload_artifact(user, id, string::utf8(b"T2"), 2025, string::utf8(b"D2"), string::utf8(b"U2"));

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(admin = @moveum, user = @0x123, aptos_framework = @0x1)]
    fun test_view_functions(
        admin: &signer, 
        user: &signer, 
        aptos_framework: &signer
    ) {
        timestamp::set_time_has_started_for_testing(aptos_framework);
        let user_addr = signer::address_of(user);
        
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        account::create_account_for_test(user_addr);
        coin::register<AptosCoin>(user);
        coin::deposit(user_addr, coin::mint<AptosCoin>(10000000, &mint_cap));

        gallery::initialize_internal(admin);

        let id_1 = string::utf8(b"ART_1");
        let id_2 = string::utf8(b"ART_2");
        
        gallery::upload_artifact(user, id_1, string::utf8(b"Title 1"), 2021, string::utf8(b"Desc 1"), string::utf8(b"Url 1"));
        gallery::upload_artifact(user, id_2, string::utf8(b"Title 2"), 2022, string::utf8(b"Desc 2"), string::utf8(b"Url 2"));

        let all_ids = gallery::get_all_artifact_ids();
        assert!(vector::length(&all_ids) == 2, 1);
        assert!(*vector::borrow(&all_ids, 0) == id_1, 2);
        assert!(*vector::borrow(&all_ids, 1) == id_2, 3);

        let (title, year, desc, url, artist) = gallery::get_artifact_details(id_1);
        
        assert!(title == string::utf8(b"Title 1"), 4);
        assert!(year == 2021, 5);
        assert!(desc == string::utf8(b"Desc 1"), 6);
        assert!(url == string::utf8(b"Url 1"), 7);
        assert!(artist == user_addr, 8);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}