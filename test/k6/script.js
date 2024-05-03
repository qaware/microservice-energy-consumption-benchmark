import {check} from 'k6';
import {SharedArray} from 'k6/data';
import http from 'k6/http';
import {randomIntBetween, randomString} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const duration = '180s'
const firstRate = 15   // 15 -- 30 -- 45 --  60 --  75
const secondRate = 30  // 30 -- 60 -- 90 -- 120 -- 150
const thirdRate = 5    //  5 -- 10 -- 15 --  20 --  25

export const options = {
    scenarios: {
        first: {
            executor: 'constant-arrival-rate', duration: duration, rate: firstRate, timeUnit: '1s',
            preAllocatedVUs: 100, maxVUs: 300,
            exec: 'first',
        },
        second: {
            executor: 'constant-arrival-rate', duration: duration, rate: secondRate, timeUnit: '1s',
            preAllocatedVUs: 100, maxVUs: 1000,
            exec: 'second',
        },
        third: {
            executor: 'constant-arrival-rate', duration: duration, rate: thirdRate, timeUnit: '1s',
            preAllocatedVUs: 100, maxVUs: 1000,
            exec: 'third',
        },
    },
};

const baseUrl = `${__ENV.APP_BASE_URL || 'http://localhost:8080'}/api/sample`;

const tokens = new SharedArray('tokens', function () {
    return [
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTAwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.dKLeMRkpMawU2Pc5vaNZTAeV6kprgmexGT9pI6GwxeOpq4G_DsTPL4GliY3n5364gPfYKOWZY8Kzzw1mrXEYtpnR8iTw1ff6cXJD-ZCrEjejCWrDp-Ex3ccUhvjVSAsACf0bCiLNLixcf02fVb3eKDheGajxI8Pg8cw3pcq-tGaKowKti7pagqJKlre-3jPvQYfN_l88n8vb8fxS9aCL2pgdPichJUNDskqoMttPSTFWb3thk2dDy7ZLEq7qYcUaXcE4DUA7A05dEj1ESGhA9Y4aQhK1q1grlpWktlZo4LWivq8ZFJisSDx2rjPVw7l2Xi4nCgK7Wno34aeVLGQNPg',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTAxIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.TYQ9y_Us0Ihu5YyVjv9wUlX9LzzI8bGYWQBbqf1CfcPw8CffzrnvGFJiB__sD2uJdNc089qYXXr0Ue2iV955mpsSr49PLQpWPij94dkmL_CaUUY4XSD8ff4neqOXYTp-uyCfOib8nAbZtNqP6WLfSvtxNOh8fI1ljfYhiR9yRhzAqD803b15ThDmAIcI1NeR3CYg6-TXHMUcEN42j3nuniUXst1UMDpOjzVIXnrQAzxmuN-skC6o0setR7jFD-g-KMg-ZUZCYkrMV8jDy2zeVfOSZicclm_jdBqr4HBjL5E2oBLuxh-dQS4a2JA86rzI9g8iYk4Zyk4CCfykrV3EKw',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTAyIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.iOQ9RWlhd2rQEP6axmPrN_prpaNMm23nCNnUTJbm70edvuPIOY4JODPssLWTakcuU-ej7nRa_xxt3HtT9HINXtXdzFqhewTp_4zVTnDR3T32x6rFA1hEvRb7qSz25S5LN0eZr2MQ2N0YraxvkVxTvJap-DUN3Hp7j0xpLh7YZgdW9CHMP1v1nNKRVSvQ1UQIRa2PS3FIrar52Ubw3zWZx_f26ZmpCAm5_ZKsA1KawUcX_861lJooEWm70yFHDMdvbiyfCg17STL5FYkuJUBq1mYAVK4xqIjISVnHSYwoLD1dsqPhsHCWGoNYu0lOKGTYQ_Qhi-2ZHlkoy3E148omDA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTAzIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.XqqZsL-WdffjRlTZuWqjQiKR9jPE5i11EpiP0tmK5RVGgcodjmK4LrYpCuGSivgMvD47JyqzCcEUhrFTxWAMUiPlBMrpRaPoQ0_VVFnM4ZEHW-EVkTKa-Dx0n321BH3Ae4wjjJ--VBXVZfIsD1G25X2iL9Kek9InpcSuobvo6lSPV0DVvee62S7Rij3t0bPlNqkWvw9TG3_f0PyTipmyxjFORYNM2VhaOaaUwKSJPxbmo64spjc_HwAWs5D5DTEgJrrylrWNnlL830xWM6UcsARuqVA0QFFyiKImP1p-whqzh6yWB9vNOgtvFkwPcUJSMtMBwavTUhRaQoj85mYVYA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA0IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.NPXhebRfjmLAC2etfwLV3X-w4cTLH9-EByF_w3RJcD8JD6EDKCel7Trrmimnf94EKUt7zmSuOnaySbLjrc20FYRIbhVmq6qzp2THPqdgfC5QgQuwY5idrp_kUUm22uEDp36Xm2E8XwjJKn6V_ZmfXhtTG6JtT1g6aznvmQvGzhLJPbqGq7zrdl6haZM6ilzyZyW_SmOspNys48DumpQN_8hH6llwCk7Ca3wryadUkDupAgo-Tkwrttr1GANOjX9xAOBBBZt34FgJNxsXBkMl3gHiwKt2352dAgmuPKlJjIFmr7Oq3QXJoll3WHYOTVKDxHhkGJUgG-RrrKf-0Cn5IQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA1IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.JXk9BjmgjpwiiJCXt6IjIMObeFbrXt1cmXU2KQ6gbKk82KQclPHYEi13QkgNaosvkqUi8ZRdTM86L2A2v4RFLHFWELgOkf-46oSXoXatTHfhJQc2HghVKAUqkMMhxr68IVU-xD8dXUk5yxNuk38X0qjRIl5Q9HDk6_tU4KCAIXu4IGK_lSaLTwT1b53PU_gKeIeRI9RVd6mWo2_SVrJf6EAB2BoXANwaZKvC2hfKsujXJPMWYEmxky3kPj9lr5dVHiUsANx7mDWcx5E-ilejZ0kyIQU6FL8VoeWJp66zy_ZP7Muujovlcf76lGNM5Z6gk3iv1TmqwTbpPe0hvUftLQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA2IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.IxXaoY2cWV-w-yhytY7GuXw6h3TQBbkBl_L8kl4yv_bKPaSJncAf5rLEH--bS6KFwrK5LVcHgGL731XaGRwCqibTK1FWWSXx2WwWMM0oeeGcILmwtSoQ12lzRmpU7kZRAZZ3upmshEpL5zDegGODk7gLWR2kx79bvcrCtld0kidkxfCkbmKnwjO_QFyDuRYUrN37abyGsCr43Ev5220VH1k1tzxg9rif-z4Azs6QL_1kt5H6MqMjSepvoErFaGqL06sSF8jJ54KYnzTN4-80s4_rkFSR9ABvOlWSxOXLcfnbEAUaPpKfIvA83mequfMd8y4Y51JyG9IYhzkZZPksoQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA3IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.CZkTh7v8f_h4KZPk8iIV_hAF2mOEVwHuIBCdyjoiU3iRf51N27CB2d7czG8GYtOb1BCLTpgwMj9boT6-SoJaiEhhPR0g8YHYUyheIYGeVtxwIM4QLwo10Hk524Dr-LkoUtQ9exATrABDL4ohaSrkKzDzb2Nj9pixZWT9d3r_8806rshUpny9dUwUWcMipN33FLbT6hFMV5JsYggxGuvlgW83ESCW3dJ_NTLDYqYSb-6igqTUmatinXELj6RZGxme0ZIDUJXPi6_gJ3P5lSwb4EFoxPSU5dUdR17CCgnsjjeASlzOaBuV4iwt3KmKgqRQkDAoZ0FRUPEmHJdT8cSaSA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA4IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.OQsvFrsTAtzZO6kbpCYlGgWno6PdNVdy8vrS5NaJQDXOQ6vEYiv57fGMhu8xW2fWGYMdCzgafSpIRobtDAUVJm4D2UlCecf_XJo2LQmnBPDealN8lwr9DtW50fEIOj8qI0Wg52Wl_2LTdUqg7_ixS832ukA62dQh4dW26QsqbAwIlJT2dUqI0MbLHoDjjXGK5d9WC9V-b-Kqdvm1fUmS_fxNTSEo3iaP_V7diVLUIAcaOQcSYmlvt2S6JRb_IcoltnUUGh7afr1tUlMoyCb_a6YXJDTW0HRzccztPo8xYaTJbndQ0lnOeSpD4vpyvJrqZW_Inp22HmYXfe5UepvDQQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTA5IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.eQIR8QhEt5fsmWq1pG1V2Xtnnhy1pKbkjpCLfumYeXaJNOsieKhi-bwXuJzxiQdDKokj8a3fHZHzWZ_jxPy5Rd7KbSVz2SiAZriIehvsOrwv-0i5wYlpzi-RJWTmnZIR_TjSoN8zPhRK1v61lU8i1T74S1RWemCHVjqGsAru7QhUdM_xrmznpDzGCUJtkhI3sEWhrNicordUswFYAWuUCkpKzIWy8nTLVB8ewQfnA_Skl5ElFR7pEZwOzUkgy4EGjerDxCV44zZuTbplHQ3WlUsaXpxdGXwlGe41IjxwBSwci6xjbQ9LCm9aKuR_XEmvjUn6FBxQimmOtFNYdQrk3g',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTEwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.WKQYIdudGgdLkNU6p6I9meMX3sLxICzAU-INEF3dId4UWBjC7ThPRMnh81K1L4RmlqKrCz4Y3SS1AFeEpzhASDjAdbvOd_OSZ1mOq92jtE0zXGr8jVoeEXHHKu_SsMOPx-EzG_851xbWMwzYRGVfbZfOF0uAk7VdQuZUdL0t1sp10cZRGoSEytHIq9FalZxcLxzq-VLWIZFMcizDXgvdBNBBkngQHOCBiXUzsvZ6Q0TA_vKLuB5HQJKkdKjuKL_HC4dYFLPm6YU3IPTa0vbiy9NzykgKyaIAYrPz_xulcWD1Km3F_bFA9WbUWuKLcPwGht1FVviZty0z7Xv-qXh5uA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTExIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.L0Jb5fPs5qVOFtFPQq0vRdH3Pa0CYiNzxHX9TT6rcbFjVFm4i_blYGER7usze65ru1zWCCZtQHOZRVFNATpGa0BgIfzvNZG8y6lRfLJD3QNtpQxq9qCAy5JWHGYaiyl2Y0o_c8mH0eHGDUWFQV0FvbWvwjbWaB7WkWgg7EXGnOn-_4hHCc1C4rIhuNW9hhiv_CqPRwc1htVZngs13zcKPK4kv8VLqUPkbA2lAbVirg5LdmbqUZVFibC2mudLGqpolFtnFT8sy8nWBqBYG3HXr6HIkz1G2pTOr7evgn_kSwc8ctfid-7ep-OA156NiMaFVdlQ8r1C3KQ-jWF08wwkCQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTEyIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.hH-vC6beF_y6cfcuIyL1G4ZiZWGCBASJi5DWnOfQtcTX4Kfv6BUpYX1-KB-NiS2KTrG23EV6VFgvJADwGpPgFq70L3WV9g6niOYRF4hkTYOOH1ArgWV9uQD8FXnHxAoVQaOwPGyxj5j1wRStcNB-2MgsAMvHLQO2Pu86tOWAt52Df5jTt7rjevnz1kFhbpwYzqkxO8Q6wkOr_Ba8oEZ86mMpXRgnPyaQvdPb_r8lJcad258Ka5HGQgQ_lNgB1izj22eme9QmIYrwNxYPEvEEkgdurmCCDaxfn1gqLK4zDvIjBBhLxxMgEXy8rpqkLDk5FsaPl1-WSs5ZtL9sYpgyug',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTEzIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.agJAV6cbUeAH5wG_hVpKnRcMSCdUvVfCRTnPTsYk-d5Ke19iWi75QHcoUfaCyTf73p_-LVBoUY5eYJ2yiYDKm4pVx617788XeYB1i_urtSZqkKsT4HFxoz0tvyP8xjus2g6DF69O_gxqdPjTIWmqZBTd17aTYA2nBuaT2bu9QkvntgfF3YC07iKBMntsZWvNuiqnr3BZpGwniUHGPilGsLrEN7gGVZm9OlGwljEVrMyh7Ayt__K0aP1K13a6ZptUA3m-gcUZRpp8fKh0nvUEOcYMM1UShlFEpCMO5Uuh3ParbH9N9WJ8CdBzzkaabYHkp-WipqmVfxOHHBFyHp1yPA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE0IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.JN9rWO0Y_L2_HqX9VV6kpJB0LdjSqRXbrZNIqopQ1WG7WRadJSVbROTsRmE9MsEVawRu0cLkbl_bW6G-cXh9UR3If2qx7lj1pU9oNbJxXGT8PwOed94vRV2kn0Be0rxWNnrcX0O2MtTgijH34mLClr3RsT9m5KGGgLBwafE3gDPG21ht6JvUX6Uo6VUMyELVBHOPkhSdpg_9Q2NiXmAo3keBm6GEgCo3jkQ_YqPratQoiIXmyGTc5vnmnHv5kPmQQOm7ZkOJDOEvaeV8gjUzCdqb-b06WnJwF2OH82vsalakxBM4few5XaKOote3gzIsuFPHdQlQmOAPGlcDvGiz8Q',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE1IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.b7EpWoRU211eJKRQXY1S0YCPXQ2lTDdo8Uz5g5I-dL0sYcCX_I87StSiI8gIK-9Wwr-vkpAl8VfLuIY034vZM3fs4hXaUCHvsRpgZhQ1Py2oE8b8Uqeyu65HE565TVtTa0qcl_iTKDLQSHpQ0EupDXUPlbhLebX8jaqwZQ0XHJHjL8Gde3Yo1OF036NMtykUVJZfjcS5Y7zbvebefnzWC1Vffu9QJ-sRRPhcs_QNpdjJYXvsxpZKUg4Tx0l5335z8qQg7CU_LYgZ8XsBiwhvdp2tXJznU0dmjINfmQVM6L8YaMMpEU-yhomvPW0kPE7SL097deBHmDSiqaTyXL7SkA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE2IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.I4trv4eAkjnm8tYTJslkPZ-ffHhwmD4IPFLc-v-UQZe_DWBdlok9hTz8CUXwOIzTedwBGmpM7qWstA9vFo1qG5zdHqjY0xtGM-hz_MaKSuBnaL-7XEMspKNXXYABvpKNAK7JVF8CP8fedm5F3_57knAy-OIpKV6HeVm8xp1lkaNm50K1t142aZBdc9lsA5nWoyxz27IJRQrx-FeCn-mvN0-FUHgx0WUqHfids9-dj_h9eT2oe5yhHGiP2G8eJNdJZxYIXYExt2YidaC8BVv-pddHAzDdHtIUQq7QqHJ3hwlFwwXNykk8k3s2KCGVLtIQk86AHX7AcmFkqQkfy_3hGQ',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE3IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.OncaIMZsE6KLgGapnLVwzwnzcxODzGKxn6HsMr8T22DzKHt5VdleTyLQLQDuIZdrkcg9g0joVdBbk1buicqUpSCFY-X17YcPqh2BFLRj_zlC0EuAMv-NIURSLNVG-q-K7katx-aDIB_krvphiXS6DZWwi6-52ab3Ijl7AEYmFD7-EK7V0gFzZWTvJtrMJgTi7MKu867HLAXW_nsv2sJlQAgUasyUPalAnYm7eIxygnjmL-fhQnUhmPqu_FeP2xXzu77oXiomfPPoqrRme9NIZgI3rbNAg2OJvP0WLtr-Vt-Yz6nRWfJT6zcHuiOuh_C9MapCeRxYi4olrr2MNEyOcA',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE4IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.Dt9QNOJJUZ5mYLmeVSE153mv-pjRgupcLRuVS5r60wXTi2yJ8Kmpt9WA9IW5JigxyEUFs6NVRTF725Cga_Gvf9LSX5QyyU1TYenWGFFLrCHeRNZtiBfp6PzrlFFE-AKSrfiDVhaf_Nit2saFJwu1XeId4WceGSCKJZ-cFlUtDR7k2CcQ9mhCNhOWLaYMspuK4Fjon_5fOYuIZ13i77pqCflDtxERwiHqEGu0NRn73bPmpHwgZNpb_DuhKUNcFuFIOUkwcHHkwyHj7KCnA7xpwpCa1uPq-nQexasERAKQeQ_-906Zry7BTRsCEm9sKtKmqiWzs51UPL46-Xgb_lao-g',
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1pZCJ9.eyJzdWIiOiJ1c2VyLTE5IiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoic2FtcGxlLWlzc3VlciIsImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMzMxMDI1NTY4LCJncm91cHMiOlsidXNlciJdfQ.BDOZ5R-8urg8gaIQLf6pniNKOSw9Z6ix_QK9eLLj99o9n6Wegrpp-Pn_PCuaryU-cg_0zj3w13E2yEUa9X5eO0Z2m1J30Ah_lW78zUQFcx4orZoq2zdxsEs-3xejDRIh0JP808cpXG1EIAFBf9AqZxUb3rnflyvj0MnYU8KVuxdFAM-8Y5tA4x_JHhl-KJFjWRjNkofxtQpZfU08-RRZtiYBO8lY9EGZOF87708ms6TaeU6FYH8yQTyiW29ym7S447zxw5yofX4abaGX2xSo_RTs17C7EgPPGpT2Vgd5dfxwzcPQxXDX2UajrAcBUzYBC2g6VsiprvWFmVKqSvcoMw',
    ];
});

export function first() {
    const userIndex = randomIntBetween(0, tokens.length - 1);
    const params = {
        headers: {
            'Authorization': 'Bearer ' + tokens[userIndex],
            'Accept': 'application/json',
        },
    };

    const resp = http.get(http.url`${baseUrl}/${randomString(5, 'abcdef') + randomIntBetween(1000, 9000)}/first`, params);
    check(resp, {
        'is status 200': (r) => r.status === 200,
    });
}

export function second() {
    const userIndex = randomIntBetween(0, tokens.length - 1);
    const params = {
        headers: {
            'Authorization': 'Bearer ' + tokens[userIndex],
            'Accept': 'application/json',
        },
    };

    const resp = http.get(http.url`${baseUrl}/${randomString(5, 'ghijkl') + randomIntBetween(1000, 9000)}/second`, params);
    check(resp, {
        'is status 200': (r) => r.status === 200,
    });
}

export function third() {
    const userIndex = randomIntBetween(0, tokens.length - 1);
    const params = {
        headers: {
            'Authorization': 'Bearer ' + tokens[userIndex],
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const body = JSON.stringify({
            "value": randomString(randomIntBetween(250, 500), 'abcdefghijklmnopqrstuvwxyz      '),
            "count": randomIntBetween(10, 100),
            "timestamp": new Date(
                randomIntBetween(2000, 2024),
                randomIntBetween(0, 11),
                randomIntBetween(1, 25),
                randomIntBetween(0, 23),
                randomIntBetween(0, 59),
                randomIntBetween(0, 59),
            ).toISOString(),
        }
    );

    const resp = http.post(http.url`${baseUrl}/${randomString(5, 'mnopqr') + randomIntBetween(1000, 9000)}/third`, body, params);
    check(resp, {
        'is status 200': (r) => r.status === 200,
    });
}
