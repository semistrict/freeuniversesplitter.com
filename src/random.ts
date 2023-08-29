export interface RandomResult {
    randomNum: number
    fake: boolean
}

// retrieved from https://qrng.anu.edu.au/random-block-alpha/ on 2023-08-29
const ANU_RAND = `3GibrP8i94kSFrQXrI7QlB9vogUk1xYQULMPP6TB7a_wdHmOsCtLkSFtYZFGOLn8NupYOT6g26xTv_vjMgV0PBGiv28nERftYXrA38zwt0IQDr_nxXnLHRUC9pkm1CuU8v3pJ6Up1EnH_Gk7UOkcDfbLhqNGIu2MsqRTtLBmzqY2ULI5KOdcuS7ecLWXRoZia5ZZQOodkNPD50keqUcAC3YWMyCswTSPNQNNKUQaW_NTyJfqqy9wpP1hica919qxzk7AYj6xZLQZqK3fjs9Q2SASQO9_JDldM53kOcDk4Ziyv1mS4KbHA3Gdwfty8a64nBWSqw1S_61_CIRDvxyxzyJHuY72RaZI8hGA8aeOjmQqFqFDIT72Lk3xxNEUxU89kq38ydZQ0LgKQQoEt6U3Lhkjq47Ld5BSv6atW6KrjG_B5KTAbVhv7JlwRJDbo4VydKuevZlX0zed2qffmRShUm_EnUHYgBqRxX8rQFs7GQUqu_h1x0YV7psIb_i0rDZeooWm5Io8d2L8lQttu6eOBA8fMYfqvddyEOXJKGtrmpIa9ki4OCaT63P8D9qbBfzUBNGQtIjjcoLJDpB4J9vFBrlgSskw0T1GAmxU8fDnyC8JtxJqdYcKZrDa_G2ga2oC7_u5kXKnBXj6EXmrQzYNVbagF69sty0YjLxAB8VeV1nHq99X1fdwzxQ338KqcbmaLN3C0AeQaDwuhHYJ3BV3X887pYSyrJ0JHztPSvDZkrIRrs0FGU7GM3czkL3JcRWNwahziZYKhvJRK36jCd3KaIev7PJXN7VAi6JLdISAoqQqtufPclgbe8TCQuWCMVWSfz9pzzXLu40sEmH5m8l3t99DuiuHgjY6DC3VILxSDBt7x8Z8sJ9zi7GbJJToi3_shIvE5DYuUZsHb7HVcZnACGc8FbeHvA9L8Tk2hHyHCuVUQEHt9LwrGSIaNt39DsyAp2BIaP3iFMwcAZbVC7mXmW_3Auv4xdJ9GMHkO2MEHX1U6tGT5NtoyU5ToXzd2G3N`
// generated using scripts/ibmq_qrng.py
const IBMQ_RAND = `3152447550`
const RANDOMNESS = ANU_RAND + ":" + IBMQ_RAND

let nextNumber = 1

export function getRandom(): number {
    return cyrb53(RANDOMNESS, Math.random() * 2_147_483_647)
}

export function getRandomRange(minInclusive: number, maxExclusive: number): number {
    let r = getRandom()
    return minInclusive + (r % (maxExclusive - minInclusive))
}

// adapted from: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = function(str: string, seed: number = 0): number {
    let h1 = 0x8b33a5130 ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};