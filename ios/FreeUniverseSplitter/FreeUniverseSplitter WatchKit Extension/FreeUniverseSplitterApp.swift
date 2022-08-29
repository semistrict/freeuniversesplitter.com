//
//  FreeUniverseSplitterApp.swift
//  FreeUniverseSplitter WatchKit Extension
//
//  Created by Ramon Nogueira on 8/21/22.
//

import SwiftUI

@main
struct FreeUniverseSplitterApp: App {
    @SceneBuilder var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }

        WKNotificationScene(
            controller: NotificationController.self,
            category: "myCategory"
        )
    }
}
