export interface RandomResult {
    randomNum: number
    fake: boolean
}

// retrieved from https://qrng.anu.edu.au/random-block-alpha/ on 2023-02-24
const RANDOMNESS = `ra8Ql9IJ_QVXaqnbR23s1sFpSOdYgiNNslVotoJuJvhBOSbnrDkKQj129U55fX9jh85GA_zl8dKOhN3PHxjjFx2tJfIdwgFWQACjgccHSpRgcB4CIgGGRBYtKUv2mvHEGwRQqJl17nzRwAWhXGBCSu_VQltRTjMQ20ts_rwWWW09byXfCuETXmwRHsowmTbvjglv070_7024p0wL25cLGkXAYvMtuxZChLFfOFuTF7ujQsbGeiTN1wOKICIEp9CLa559ezJ4h0sr9oaEUdLdnOzW9rn3Nc6pwcqLydC7Nv2sY_edCg3ZEl72KeR7Tz9iolIvx3oXgDl8Bqc0zWmVRzb_IejFBa4ibElkCs99AB28ksgbmmqJFMhlxWjgZXsoKzo9MzGIHRBZj5sP4DknPE18azWllWeydf9pQxM1lsTgxPAlbS72keaY7wO6HPaDKC4n0cdKbNFVDjRVJGXZEDjUEAi7GwGPMgNGTQ0ux6PWvampPkAtydEyZDomq2SJM4zJOmKwM6HQx8Yhr0Elw4VsYwXbnaS43OXfJJAPwSxITpixShlWj6iSGJRaZrlVQsGAcOkmy5bmI3tF71Z3hWrwA4FcsM4Tt8SdQJaWo3Iz2fhaxeDMWMLsvC8LSK8yVAMHOQ8cKau3ESM5uvUdM_fD1EZR0HZoBjPkvCUT3CYy9X3QvTuNxlN_2VKTrhKGTcVdEKxaKBcXV1eGzPJUXA7QzZuWwoc5UB2idc6VqcfOQZEmormVtTZnlb3qxbgJnJpiv21zWwd0EYt3ltuPbpTDwOaZqpeLP6AIYuKUJb31v1nRN4HyeF0NFeNyyRnxenj7tcDEEtGSZTXRloKuIAJECyx2TgT7NmxkG8fNJNqyDBkyGEF1v80wKj67SykIDJhfTsvtoxu7_9NQ82UIfJfrwfd16mH5PCmdXEIpXrioq5zd9F0tSftrG7yC7tY3_7XV2WfaqyEFTG7I7xhT5ydayE9qzGQVrYPqa1WIVoFl30LySyLPuCTnOCKSakAu`

let nextNumber = 1

export async function getRandom(): Promise<RandomResult> {
    return {
        randomNum: cyrb53(RANDOMNESS, Math.random() * 2_147_483_647), 
        fake: false
    }
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