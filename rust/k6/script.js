import {check} from 'k6';
import http from 'k6/http';
import {randomString,randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    scenarios: {
        get_data: {
            executor: 'constant-arrival-rate',
            exec: 'getData',
            rate: 50,
            timeUnit: '1s',
            duration: '60s',
            preAllocatedVUs: 100, // how large the initial pool of VUs would be
            maxVUs: 1000, // if the preAllocatedVUs are not enough, we can initialize more
        },
        put_data: {
            executor: 'constant-arrival-rate',
            exec: 'putData',
            rate: 5,
            timeUnit: '1s',
            duration: '60s',
            preAllocatedVUs: 100, // how large the initial pool of VUs would be
            maxVUs: 1000, // if the preAllocatedVUs are not enough, we can initialize more
        },
    },
};

export function getData() {
    const ids = [
        'i00001',
        'i00002',
        'i00003',
        'i00004',
        'i00005',
        'i00006',
        'i00007',
        'i00008',
        'i00009',
        'i00010',
        'i00011',
    ];

    const res = http.get('http://localhost:8081/api/data/'+ids[randomIntBetween(0, ids.length)]);

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}

export function putData() {
    const id = 'u' + randomString(4, 'abcdefghijklmnopqrstuvwxyz0123456789');
    const url = 'http://localhost:8081/api/data/' + id;

    const payload = JSON.stringify({
        id: id,
        created_at: new Date().toISOString(),
        text: 'sample text ' + randomString(10),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.put(url, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}