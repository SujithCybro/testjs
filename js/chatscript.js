    (function () {

        origin = window.location.protocol + '//' + window.location.host;
        originalPath = window.location.pathname;
        console.log(origin);
        $.ajax({
            url: "https://localhost:7134/account/getsitekey",
            type: "POST",
            data: {
                "host":origin
            },
            success:function(response) {
                console.log(response);
                sessionStorage.setItem("JsKey", response);
                initChatWidget(response);
            }
        });
        var siteKey = sessionStorage.getItem("JsKey");
        //console.log(siteKey);
        // Default configuration options
        var config = {
            sourceIdentifier: siteKey,
            theme: 'default',
            position: 'bottom-right',
            // ... other configuration options
        };
              
        // Function to initialize the chat widget with user-defined options
        function initChatWidget(sitekey) {
            // Merge user-defined options with default options
            var config = {
                sourceIdentifier: siteKey,
                theme: 'default',
                position: 'bottom-right',
                // ... other configuration options
            };

            // Your chat widget logic goes here
            console.log("Chat widget loaded with configuration:", config);
            var chatWidgetHTML = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Widget</title>
        <link href="https://localhost:7134/chat-widget/stylesheet.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-...">

        <style>.startchat{width:100%;padding:7px;text-align:center;justify-content:center;align-items:center;display:flex;font-size:18px;margin-top:30px}input.form-input{width:97%;padding:9px;margin:7px;border-radius:10px}.bi-send{margin:0 6px}.clip-upload{position:absolute;margin:0% 76%;bottom:12px}.clip-upload>input{display:none}#message-display li{list-style:none}li.senderli{display:flex;flex-direction:row-reverse}.upload-preview{margin-bottom:2px}.message-display{overflow:auto;display:flex;flex-direction:column-reverse;height:71%}.receiverli{background-color:#E3E3E3}</style>
    </head>
    <body>
        <div id="chat-widget">
            <div id="chat-header">
                <div id="chat-close-btn" onclick="toggleChat()">&times;</div>
                <input type="text" id="userId" hidden />
                <input type="text" id="ReceiverId" hidden />
                <input type="text" id="userInput" hidden />
                <input type="text" id="UserName" hidden />
                <input type="text" id="receiverInput" hidden />
                <div class="chat-settings-icon">
                    <div class="dropdown">
                        <button class="btn dropdown-toggle" type="button" id="Chat-settings" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="Chat-settings">
                            <li><div class="dropdown-item" id="Copy-session">Copy</div></li>
                            <li><div class="dropdown-item" id="EndSession">End Session</div></li>
                            <li><div class="dropdown-item" id="TranscriptRequest">Request Transcript</div></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>

            </div>
            <div class="message-display">
                <div id="message-display">
                    <div class="userInfo" id="userInfo">

                        <p>Please fill the form!</p>
                        <div class="form-group">
                            <input type="text" class="form-control form-input"
                                   id="username" name="username" aria-describedby="username"
                                   placeholder="Enter Name" onblur="uservalidate()">
                            <span id="UserValidate" hidden></span>
                        </div>
                        <div class="form-group">
                            <input type="Email" class="form-control form-input"
                                   id="EmailId" name="EmailId" placeholder="Mail Id">
                            <span id="mail validate" hidden></span>
                        </div>
                    </div>
                    <button id="startchat" class="startchat">
                        Start Chat  <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <div id="message-sent-box">
                <div class="upload-preview col-12"></div>
                <input type="hidden" id="upload-input" />
                <input type="text" id="message-input" placeholder="Type your message...">
                <div class="clip-upload">
                    <label for="file-input">
                        <i class="fa fa-paperclip fa-lg" aria-hidden="true"></i>
                    </label>
                    <input type="file" name="file" id="file-input" onchange="getUrl()">
                </div>
                <div class="emoji-picker">

                </div>
                <button id="sendButton">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>

            </div>
        </div>

        <div id="chat-icon" >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text" viewBox="0 0 16 16">
                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
            </svg>
        </div>

       
        <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/8.0.0/signalr.min.js" integrity="sha512-7rhBJh1om/W5Ztx7WiYOR9h2wlSaTmPyQMoHFtbT/FVNIA12y6S6I8HY9mrBS1uJ3dSU/R3qaSAXsGYuRjMDxg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>
    </html>`;
            document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);
           
            //var scripts = ['https://code.jquery.com/jquery-3.6.4.min.js',
            //    'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.min.js',
            //'https://raw.githubusercontent.com/SujithCybro/testjs/main/chat-widget/chat.js'];
            //var s0 = document.getElementsByTagName('script')[0];
            //for (var i = 0; i < scripts.length; i++) {
            //    var s1 = document.createElement('script');
            //    s1.src = scripts[i];
            //    s1.type = 'text/plain';
            //    s1.charset = 'UTF-8';
            //    s1.setAttribute('crossorigin', '*');
            //    s0.parentNode.insertBefore(s1, s0);
            var scriptSources = [
                'https://code.jquery.com/jquery-3.6.4.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.1/signalr.min.js',
                'https://localhost:7134/js/signalr/dist/browser/signalr.js',
                'https://cdn.jsdelivr.net/gh/SujithCybro/testjs@main/chat-widget/chat.js'
            ];

            scriptSources.forEach(function (src) {
                var script = document.createElement('script');
                script.src = src;
                script.type = 'text/javascript';
                script.async = true;
                script.charset = 'UTF-8';
                script.setAttribute('crossorigin', '*');
                document.head.appendChild(script);
            });
            
        }
      
    })();