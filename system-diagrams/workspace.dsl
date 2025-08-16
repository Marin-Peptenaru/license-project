workspace {

    model {
        ss = softwareSystem "Proof of concept API" {

            apiGateway = container "API Gateway" "Reverse proxy that accepts incoming traffic from client systems and forwards to the REST API or the Notification API depending on the request URL" "Nginx Instance: Runs on port 8080"

            database = container "NoSQL Database" "MongoDB Database: Mongo Atlas Cluster" {
                tags = "Database"
            }

            streamingService = container "In Memory Store & Streaming Service" "Integration service that allows communication between services of the the developed system through a publish-subscribed model" "Redis Instance: Runs on port 6379 " {
                tags = "StreamService"
            }

             restApi = container "Rest API" "Back-end Application that handles Authentication, Authorization and CRUD operations through a REST API" "Golang Web Server: Runs on port 8081" {
                authController = component "Authentication Controller" {

                }

                authService = component "Authentication Service" {

                }

                cacheMap = component "Cache Map" {

                }

                authController -> authService "Uses"
                authService -> cacheMap "Stores hashed refresh tokens"

                userController = component "User Controller" {

                }

                userService = component "User Service" {

                }

                userController -> userService "Uses to fetch and register users"

                messageController = component "Message Controller" {

                }

                messageService = component "Message Service" {

                }

                messageNotifier = component "Messasge Notifier" {

                }

                messageController -> messageService "Uses to fetch and persist messages"
                messageService -> messageNotifier "Delegates publishing messages for other running services"

                topicController = component "Topic Controller" {

                }

                topicService = component "Topic Service" {

                }

                subscriptionNotifier = component "Subscription Notifier" {

                }

                streamWriter = component "Stream Writer"

                topicController -> topicService "Uses to fetch, create topics and handle users subscribing / unsubscribing to topics"
                topicService -> subscriptionNotifier "Delegates publishing subscription changes for other running services"

                subscriptionNotifier -> streamWriter "Delegates publishing subscription changes to the subscriptions stream"
                messageNotifier -> streamWriter "Delegates publishing messages to the messages stream"

                streamWriter -> streamingService "Writes new entries to streams"

                apiGateway -> topicController "Forwards API calls related to topic CRUD operations and subcriptions"
                apiGateway -> userController "Forwards API calls related to user registration and searching users"
                apiGateway -> messageController "Forwards API calls related to fetching messages and publishing new messages"
                apiGateway -> authController "Forwards API calls related to generating, refreshing and invalidating JWTs"

                cacheMap -> streamingService "Stores and deletes refresh token hashes with expiration"
                userService -> database "Reads from and writes to"
                authService -> database "Reads from and writes to"
                messageService -> database "Reads from and writes to"
                topicService -> database "Reads from writes to"
             }

            notificationsApi = container "Notifications API" "Back-end Application that allows authenticated users to listen for notifications related to their subscriptions. Both SSE and WebSockets are supported, implementation to be used can be configured." "Golang Web Server: Runs on port 8082" {
                messageNotificationsControler = component "Message Notification Controller" "Accepts connections and sends notifications regarding relevant messages to each connected user. Does not requires restarting the conenction if the listening user's subscription change." "Implementation can be configured to use either WebSockets or SSE"

                messageListener = component "Message Listener" "Implements business logic layer of checking which message are relevant for a given user depending on their subscriptions and then publishing them to a channel. Spawns one goroutine and creates one channel per user. Spawns one goroutine. Creates one channel per Subscribe() call."

                streamObserver = component "Stream Observer" "Queries Streaming Service for any new published items to a given stream, parses them and publishes them to an observable by writing them to a list of channels. Upper bound of items to read at a time and frequency can be configured. Spawns one goroutine and creates one set of observable channels per stream. "

                userSubscriptionObserver = component "User Subscription Observer" "Synchronized in memory store that listens for changes to a given user's subscription changes. Uses a read-write lock to provide safe access to its internal state. Each instance creates a read-write lock."

                messageNotificationsControler -> messageListener "Receives messages for a given user from"

                messageListener -> streamObserver "Receives published messages through a channel created by"

                messageListener -> userSubscriptionObserver "Reads user subscription status from"

                userSubscriptionObserver -> streamObserver "Receives subscription changes through a channel created by"

                streamObserver -> streamingService "Queries for new items published to a given stream. "

                userSubscriptionObserver -> database "Reads from"

                messageListener -> database "Reads from"

                apiGateway -> notificationsApi "Proxies client connections established for live notifications"
                apiGateway -> messageNotificationsControler "Proxies client connections established for live notifications"

            }
    }

        webC = softwareSystem "Web Client" {
            tags = "Web, External"
        } 

        mobileC = softwareSystem "Mobile Client" {
            tags = "Mobile, External"
        }

        serviceC = softwareSystem "Client Service" {
            tags = "Service, External"
        } 

        
        webC -> apiGateway "Connects via HTTP / SSE / Websockets"
        mobileC -> apiGateway "Connects via HTTP / SSE / Websockets"
        serviceC -> apiGateway "Connects via HTTP / SSE / Websockets"
        apiGateway -> restApi "Delegates AuthN, AuthZ and CRUD operations"
    }

    views {
        systemContext ss "SystemContext" {
            include * 
        }

        container ss "SystemArchitecture" {
            include *
        }

        component restApi "RestAPIComponents" {
            include ->restApi->
            include *
            autoLayout tb
        }

        component restApi "AuthenticationComponents" {
            include ->authController->
            include ->authService->
            include ->cacheMap->
        }

        component restApi "TopicAndMessage" {
            include ->topicController->
            include ->messageController->
            include ->topicService->
            include ->messageService->
            include ->subscriptionNotifier-> 
            include ->messageNotifier->
            include ->streamWriter->
        }

        component notificationsApi "NotificationsAPIComponents" {
            include ->notificationsApi->
            include *
        }

        component notificationsApi "StreamObserver" {
            include streamObserver->
        }

        component notificationsApi "Listeners" {
            include messageListener->
            include ->userSubscriptionObserver->
            include ->streamObserver->
        }

        component notificationsApi "MessageNotificationController" {
            include ->messageNotificationsControler->
            autoLayout tb
        }

        styles {
            element "Element" {
                background #6699ff
            }

            element "Database" {
                shape Cylinder
            }

            element "StreamService" {
                shape Pipe
            }

            element "External" {
                background #e6e6e6
            }

            element "Web" {
                shape WebBrowser
            }

            element "Service" {
                shape Hexagon
            }

            element "Mobile" {
                shape MobileDevicePortrait
            }
        }
    }

}