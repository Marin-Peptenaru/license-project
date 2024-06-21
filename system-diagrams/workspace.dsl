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
                messageNotifier -> streamingService "Publishes new messages to messages stream"

                topicController = component "Topic Controller" {

                }

                topicService = component "Topic Service" {

                }

                subscriptionNotifier = component "Subscription Notifier" {

                }

                topicController -> topicService "Uses to fetch, create topics and handle users subscribing / unsubscribing to topics"
                topicService -> subscriptionNotifier "Delegates publishing subscription changes for other running services"
                subscriptionNotifier -> streamingService "Publishes subscripition changes to subscriptions stream"


                apiGateway -> topicController "Forwards API calls related to topic CRUD operations and subcriptions"
                apiGateway -> userController "Forwards API calls related to user registration and searching users"
                apiGateway -> messageController "Forwards API calls related to fetching messages and publishing new messages"
                apiGateway -> authController "Forwards API calls related to generating, refreshing and invalidating JWTs"

                cacheMap -> streamingService "Stores and deletes refresh token hashes with expiration"

             }

            notificationsApi = container "Notifications API" "Back-end Application that allows authenticated users to listen for notifications related to their subscriptions. Both SSE and WebSockets are supported, implementation to be used can be configured." "Golang Web Server: Runs on port 8082" {


    
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
        restApi -> database "Reads from and writes to"
        notificationsApi -> database "Reads from"
        apiGateway -> restApi "Delegates AuthN, AuthZ and CRUD operations"
        apiGateway -> notificationsApi "Proxies client connections established for live notifications"
        restApi -> streamingService "Publishes notifications about new messages being added to a topic or a user's subscription changing. \n Caches hashed refresh tokens used for refreshing users' authentication."
        notificationsApi -> streamingService "Receives items published by the REST API service."
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