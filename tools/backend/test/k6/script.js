import {check} from 'k6';
import http from 'k6/http';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const duration = '30s'
const smallRate = 1500
const mediumRate = 1000
const largeRate = 500

export const options = {
  scenarios: {
    fetchSmall: {
      executor: 'constant-arrival-rate', duration: duration, rate: smallRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 1000,
      exec: 'fetchSmall',
    },
    fetchMedium: {
      executor: 'constant-arrival-rate', duration: duration, rate: mediumRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 1000,
      exec: 'fetchMedium',
    },
    fetchLarge: {
      executor: 'constant-arrival-rate', duration: duration, rate: largeRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 1000,
      exec: 'fetchLarge',
    },
    pushSmall: {
      executor: 'constant-arrival-rate', duration: duration, rate: smallRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 300,
      exec: 'pushSmall',
    },
    pushMedium: {
      executor: 'constant-arrival-rate', duration: duration, rate: mediumRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 300,
      exec: 'pushMedium',
    },
    pushLarge: {
      executor: 'constant-arrival-rate', duration: duration, rate: largeRate, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 300,
      exec: 'pushLarge',
    },
  },
};

const baseUrl = 'http://localhost:8500/api';
const params = {
  headers: {
    'Accept': 'application/json',
  },
};

export function fetchSmall() {
  const resp = http.get(baseUrl + '/fetch/123/small', params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function fetchMedium() {
  const resp = http.get(baseUrl + '/fetch/456/medium', params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function fetchLarge() {
  const resp = http.get(baseUrl + '/fetch/789/large', params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function pushSmall() {
  const resp = http.post(baseUrl + '/push/123/small', randomString(100), params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function pushMedium() {
  const resp = http.post(baseUrl + '/push/456/medium', randomString(1000), params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

export function pushLarge() {
  const resp = http.post(baseUrl + '/push/789/large', randomString(100000), params);
  check(resp, {
    'is status 200': (r) => r.status === 200,
  });
}

