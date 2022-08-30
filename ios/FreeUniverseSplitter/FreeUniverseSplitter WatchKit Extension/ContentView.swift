//
//  ContentView.swift
//  FreeUniverseSplitter WatchKit Extension
//
//  Created by Ramon Nogueira on 8/21/22.
//

import SwiftUI
import CommonCrypto

struct ContentView: View {
    @State var result: String = "?"

    // retrieved from
    //  curl "https://qrng.anu.edu.au/API/jsonI.php?length=255&type=uint8"
    static let quantumRandomness: [UInt8] = [173,197,56,101,249,71,45,220,95,44,80,25,125,133,100,114,223,123,94,81,248,63,47,14,174,134,139,107,181,85,63,205,125,141,154,151,21,127,193,80,255,171,66,192,28,99,6,232,183,146,33,227,136,96,174,152,6,243,48,124,128,189,59,211,64,202,205,99,162,41,130,163,32,67,80,164,71,194,102,231,95,222,183,225,83,91,187,96,57,205,116,141,118,64,160,82,201,87,193,8,35,122,8,65,69,107,118,174,53,179,142,119,202,142,94,183,2,25,106,105,145,250,224,29,48,47,220,150,193,42,176,217,6,169,101,234,215,117,36,148,78,19,70,127,33,142,88,143,0,63,34,18,25,72,215,3,162,207,93,145,239,107,90,2,118,143,85,35,99,228,93,233,122,163,213,76,15,84,32,85,162,186,120,162,21,196,238,160,164,171,215,44,234,3,35,78,165,38,202,150,113,228,52,173,159,74,94,191,121,85,92,60,237,207,0,146,43,13,170,136,231,152,26,217,77,146,160,199,195,26,139,232,124,82,233,52,147,126,170,218,212,198,49,173,187,94,233,88,108,152,54,165,253,67,152]

    static func random() -> Int {
        var data = Data(quantumRandomness)
        data.append(Data(UUID().uuidString.utf8))
        var digest = [UInt8](repeating: 0, count:Int(CC_SHA1_DIGEST_LENGTH))
        data.withUnsafeBytes {
            _ = CC_SHA1($0.baseAddress, CC_LONG(data.count), &digest)
        }
        return numericCast(digest.reduce(0) { v1, v2 in v1 ^ v2 })
    }

    var body: some View {
        Text(result)
            .font(.largeTitle)
            .foregroundColor(Color.green)
            .padding()
            .onTapGesture {
                let r = Self.random()
                let device = WKInterfaceDevice.current()
                if r % 2 == 0 {
                    result = "No"
                    device.play(.failure)
                } else {
                    result = "Yes"
                    device.play(.success)
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    result = "?"
                }
            }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
