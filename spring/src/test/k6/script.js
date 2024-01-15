import {check} from 'k6';
import {SharedArray} from 'k6/data';
import http from 'k6/http';

export const options = {
  scenarios: {
    overview: {
      executor: 'constant-arrival-rate', duration: '90s', rate: 20, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 300,
      exec: 'overview',
    },
    detail: {
      executor: 'constant-arrival-rate', duration: '90s', rate: 100, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 1000,
      exec: 'detail',
    },
  },
};

const baseUrl = `http://${__ENV.APP_HOSTNAME || 'localhost'}:8080/api/sample/items`;

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
  ];
});

export function overview() {
  const userIndex = Math.floor(Math.random() * 10);
  const params = {
    headers: {
      'Authorization': 'Bearer ' + tokens[userIndex],
      'Accept': 'application/json',
    },
  };

  const overviewUrl = baseUrl + '?from=item-id-' + (1000 + 10 * Math.floor(Math.random() * 500) + userIndex)
  const resp = http.get(overviewUrl, params);
  if (resp.status !== 200) {
    // exec.test.abort(overviewUrl + ' for user ' + userIndex + ' with status ' + resp.status);
  }
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function detail() {
  const userIndex = Math.floor(Math.random() * 10);
  const params = {
    headers: {
      'Authorization': 'Bearer ' + tokens[userIndex],
      'Accept': 'application/json',
    },
  };

  const detailUrl = baseUrl + '/item-id-' + (1000 + 10 * Math.floor(Math.random() * 500) + userIndex);
  const resp = http.get(detailUrl, params);
  if (resp.status !== 200) {
    // exec.test.abort(detailUrl + ' for user ' + userIndex + ' with status ' + resp.status);
  }
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}
