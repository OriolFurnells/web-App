var app = new Vue({
    el: '#app',

    data: {

        //arrays que obtengo del jason
        info: [],
        teams: [],
        matches: [],

        //variables que relleno mediante funciones
        temporalInfo: [],
        moreInfo2: [],
        election: "",
        window: "",
        nameTeamActive: null,
        teamStadium: {},
        weekSelected: "",
        teamLocation: "",

        //id de paginas:
        //                menu: "",
        matches: "",
        locationsList: "",
        chat: "",
        locationsMap: "",

        //BOLEANOS PARA V-SHOW
        teamMenu: true,
        menu: true,
        matchesV: false,
        locationsList: false,
        chat: false,
        locationMap: false,
        teamSelected: false,
        dateSelected: false,
        conected: false,
        chatWindow: true,


        //------------------

        logoChange: "",
        needConexion: "Necesitas estar conectado para usar el chat",
        sendMessage: "Enviar un mensaje para ver la conversación",
        weeks: [],
        address: [],
        dates: [],
        hours: [],
        chatPrivate: "",
        provider: "",
        message: "",
        userNameChat: "",
        logOk: "",
        favorite: false,

        //        dayNumber: 0,
        //        monthNumber: 0,
        //        year: 0,
        //        monthText: "",
        //        monthYear: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        //        dateText: [],


    },

    created: function () {
        this.start();
    },

    methods: {

        //función de arranque
        start: function () {
            fetch("https://api.myjson.com/bins/g0bf0", {
                method: "GET",
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            }).then(function (json) {
                app.info = json;
                app.matches = app.info.matches;
                app.teams = app.info.teams;
                app.extractInfo();


            }).catch(function (error) {
                console.log("Request failed:" + error.message);
            })
        },
        //función para convertir fecha numerica en texto, suprime 0 si van delatne OK--
        /*
                //                changeDate: function () {
                //
                //                    //            console.log(app.dates)
                //                    //            console.log("hola")
                //                    let month = "";
                //                    let day = "";
                //                    //			this.dates= "03/03/2018"
                //                    for (let i = 0; i < this.dates.length; i++) {
                //                        //this.dates = ;
                //                        //				console.log(this.dates)
                //                        day = this.dates[i].slice(0, 2);
                //                        //				console.log(day)
                //                        let dayFirst = day.slice(0, 1);
                //
                //                        if (dayFirst == "0") {
                //                            this.dayNumber = this.dates[i].slice(1, 2);
                //                            //                    console.log(this.dayNumber)
                //                        } else {
                //                            this.dayNumber = this.dates[i].slice(0, 2);
                //                            //                    console.log(this.dayNumber)
                //                        }
                //
                //                        //				console.log(this.dayNumber)
                //
                //                        month = this.dates[i].slice(3, 5);
                //                        let monthFirst = month.slice(0, 1);
                //
                //                        if (monthFirst == "0") {
                //                            //                    console.log(montFirst)
                //                            this.monthNumber = this.dates[i].slice(4, 5);
                //                        } else {
                //                            this.monthNumber = this.dates[i].slice(3, 5);
                //                        }
                //
                //                        this.year = this.dates[i].slice(6, 10);
                //                        //				console.log(this.monthNumber)
                //                        this.monthText = this.monthYear[this.monthNumber];
                //                        //				console.log(this.monthText)
                //
                //                        let fecha = this.dayNumber + " de " + this.monthText + " del " + this.year;
                //                        //				console.log(fecha);
                //                        //			console.log(this.dateText)
                //                        this.dateText.push(fecha);
                //                    }
                //                    //            console.log(this.dateText)
                //
                //                },
                */
        //¿?¿?¿? fncion por parametros pero no recuerdo para que
        option: function (array, teamSelected, change) {
            for (let i = 0; i < array.length; i++)
                if (Selected == array[i]) {
                    Change = Selected;
                }
        },

        //función para extraer información
        extractInfo: function () {
            //funciona OK -extraigo el nombre  del estadio y la dirección para el listado 
            for (let i = 0; i < app.teams.length; i++) {
                let stadium = app.teams[i].stadium;
                let direction = app.teams[i].adress;
                let addressComplete = stadium + " - " + direction;
                app.address.push(app.addressComplete);
                //                console.log(app.addressComplete);
                //						console.log(app.moreInfo2)
            }

            //funciona OK - extraigo la información de las jornadas
            for (let i = 0; i < app.matches.length; i++) {
                app.temporalInfo = app.matches[i].info;
                app.moreInfo2.push(app.temporalInfo);
            }
            //						console.log(app.moreInfo2)

            //funciona OK - extraigo información concreta de todas las jornadas, PDTE CAMBIAR POR PARAMETROS PARA FECHA - HORA (para la ventana de MATCHES - MORE INFO)
            for (let k = 0; k < app.moreInfo2.length; k++) {
                for (let v = 0; v < app.moreInfo2[k].length; v++) {
                    app.hours = app.moreInfo2[k][v].hour;
                }
            }

            for (let k = 0; k < app.moreInfo2.length; k++) {
                for (let v = 0; v < app.moreInfo2[k].length; v++) {
                    app.dates.push(app.moreInfo2[k][v].date);
                }
            }
            //            console.log(app.dates)


        },

        //funciona OK, marca el equipo PDTE fecha activos
        selectedWeek: function () {
            app.weekSelected = document.getElementById("date").value;
            console.log(event.target)
        },

        //funciona OK coge el valor del data attribute de options y  cambia el valor de los booleanos de v-show
        selectedWindow: function () {
            let selectedEvent = event.target;
            console.log(selectedEvent)
            app.election = selectedEvent.getAttribute("data-option");
            console.log(app.election);
//            console.log(this.$refs.el)

            
            if (app.election == "menu") {
                app.menu = true;
                app.teamMenu = true;
                app.matchesV = false;
                app.locationsList = false;
                app.chat = false;
                app.locationMap = false;
                
            } else if (app.election == "matches") {
                app.matchesV = true;
                app.teamMenu = true;
                app.locationsList = false;
                app.chat = false;
                app.menu = false;
                app.locationMap = false;
            } else if (app.election == "LocationList") {
                app.locationsList = true;
                app.matchesV = false;
                app.chat = false;
                app.menu = false;
                app.teamMenu = false;
                app.locationMap = false;
            } else if (app.election == "chat") {
                app.chat = true;
                app.matchesV = false;
                app.locationsList = false;
                app.menu = false;
                app.teamMenu = false;
            }
        },

        reset: function () {
            app.nameTeamActive = null;
            app.weekSelected = "";
            console.log(app.nameTeamActive);
            console.log(app.weekSelected);
        },

        selectTeam: function () {
            let selectedTeam = event.target;
            app.nameTeamActive = selectedTeam.getAttribute("data-selectTeam");
            console.log(app.nameTeamActive)
            app.chatPrivate = document.getElementById("conversationPrivate");
            app.chatPrivate.innerHTML = "";
        },

        //funciona, detecta equipo seleccionado y devuelve ID
        selectStadium: function () {
            let selected = event.target;
            app.teamLocation = selected.getAttribute("data-stadium");
            console.log(app.teamLocation);
            app.locationMap = true;
         
            app.teamStadium = [];
            for (let i = 0; i < app.teams.length; i++)
                if (app.teamLocation == app.teams[i].id) {
                    app.teamStadium = app.teams[i]
                }
            //				console.log(app.teamStadium);

        },
        selectedWeek: function () {

            let selectedTeam = event.target;
            app.weekSelected = "Semana " + selectedTeam.getAttribute("data-selectWeek");
//            selectedTeam.getAttribute("data-selectWeek").classList.remove("active");
//            event.target.setAttribute("class", "active");
            console.log(app.weekSelected)
        },

        
        //FUNCIONES CHAT
        //función de log in
        login: function () {
            //documentación
            // https://firebase.google.com/docs/auth/web/google-signin
            // Provider
            this.provider = new firebase.auth.GoogleAuthProvider();
            //            this.provider = new firebase.auth.FacebookAuthProvider();

            // How to Log In
            firebase.auth().signInWithPopup(this.provider)
                .then(function () {
                    //       console.log(firebase.auth());
                    app.conected = true;
                    app.logOk = firebase.auth().currentUser.displayName;
                    console.log(app.logOk);

                })
                .catch(function () {
                    alert("El usuario o la contraseña son erroneos");
                });
        },

        logout: function () {
            firebase.auth().signOut().then(function () {
                app.conected = false;
                console.log("DESCONECTADO");
                console.log(this.conected);
                // Sign-out successful.
            }).catch(function (error) {
                // An error happened.
            });
        },

        printChat: function () {
            this.conversation();
            this.getPosts();
            document.getElementById("message").value = " ";
        },
        conversation: function () {
            // https://firebase.google.com/docs/database/web/read-and-write
            // Values
            this.message = document.getElementById("message").value;
            console.log(this.message)
            app.userNameChat = firebase.auth().currentUser.displayName;
            //            console.log("userNameChat"+this.userNameChat)
            return firebase.database().ref("fefaGeneral").push({
                name: this.userNameChat,
                body: this.message
            });
        },

        getPosts: function () {
            firebase.database().ref('fefaGeneral').on('value', function (data) {
                var posts = document.getElementById("conversation");

                posts.innerHTML = "";

                var messages = data.val();

                for (var key in messages) {
                    var line = document.createElement("div");
                    var text = document.createElement("p");
                    var people = document.createElement("p");
                    var element = messages[key];
                    if (element.name == app.logOk) {

                        text.setAttribute("class", "chatMeBackground ");
                        people.setAttribute("class", "chatMe");
//                        line.setAttribute("class", "chat");
                    } else {
                        text.setAttribute("class", "chatYouBackground");
                        people.setAttribute("class", "chatYou");
//                        line.setAttribute("class", "chat");
                    }

                    people.append(element.name);
                    people.append(":");

                    text.append(element.body);
                    line.append(people);
                    line.append(text);
                    posts.append(line);

                    var element = document.getElementById("conversation");
                    element.scrollIntoView(false);
                }
            })

        },

        printChatPrivate: function () {
            this.chatTeams();
            this.PostsTeams();
            document.getElementById("messagePrivate").value = " ";
        },
        chatTeams: function () {
            if (app.nameTeamActive == "1") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                app.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Dracs").push({
                    name: this.userNameChat,
                    body: this.message
                });

            } else if (app.nameTeamActive == "2") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                this.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Voltors").push({
                    name: this.userNameChat,
                    body: this.message
                });
            } else if (app.nameTeamActive == "3") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                this.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Firebats").push({
                    name: this.userNameChat,
                    body: this.message
                });
            } else if (app.nameTeamActive == "4") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                this.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Hurricanes").push({
                    name: this.userNameChat,
                    body: this.message
                });
            }

        },
        
        PostsTeams: function (team) {

            if (app.nameTeamActive == "1") {

                firebase.database().ref('Dracs').on('value', function (data) {

                    app.chatPrivate = document.getElementById("conversationPrivate");
                    app.chatPrivate.innerHTML = "";
                    var messages = data.val();

                    for (var key in messages) {
                        var line = document.createElement("div");
                        var text = document.createElement("p");
                        var people = document.createElement("p");
                        var element = messages[key];

                        if (element.name == app.logOk) {

                            text.setAttribute("class", "chatMeBackground ");
                            people.setAttribute("class", "chatMe");
                        } else {
                            text.setAttribute("class", "chatYouBackground");
                            people.setAttribute("class", "chatYou");
                        }


                        people.append(element.name);
                        people.append(":");

                        text.append(element.body);
                        line.append(people);
                        line.append(text);
                        app.chatPrivate.append(line);


                        var element = document.getElementById("conversationPrivate");
                        element.scrollIntoView(false);

                    }
                })

            } else if (app.nameTeamActive == "2") {

                firebase.database().ref('Voltors').on('value', function (data) {

                    app.chatPrivate = document.getElementById("conversationPrivate");
                    app.chatPrivate.innerHTML = "";
                    var messages = data.val();

                    for (var key in messages) {
                        var line = document.createElement("div");
                        var text = document.createElement("p");
                        var people = document.createElement("p");
                        var element = messages[key];
                        if (element.name == app.logOk) {

                            text.setAttribute("class", "chatMeBackground ");
                            people.setAttribute("class", "chatMe");
                        } else {
                            text.setAttribute("class", "chatYouBackground");
                            people.setAttribute("class", "chatYou");
                        }


                        people.append(element.name);
                        people.append(":");

                        text.append(element.body);
                        line.append(people);
                        line.append(text);
                        app.chatPrivate.append(line);


                        var element = document.getElementById("conversationPrivate");
                        element.scrollIntoView(false);

                    }
                })
            } else if (app.nameTeamActive == "3") {

                firebase.database().ref('Firebats').on('value', function (data) {

                    app.chatPrivate = document.getElementById("conversationPrivate");
                    app.chatPrivate.innerHTML = "";
                    var messages = data.val();

                    for (var key in messages) {
                        var line = document.createElement("div");
                        var text = document.createElement("p");
                        var people = document.createElement("p");
                        var element = messages[key];
                        if (element.name == app.logOk) {

                            text.setAttribute("class", "chatMeBackground ");
                            people.setAttribute("class", "chatMe");
                        } else {
                            text.setAttribute("class", "chatYouBackground");
                            people.setAttribute("class", "chatYou");
                        }


                        people.append(element.name);
                        people.append(":");

                        text.append(element.body);
                        line.append(people);
                        line.append(text);
                        app.chatPrivate.append(line);



                        var element = document.getElementById("conversationPrivate");
                        element.scrollIntoView(false);


                    }
                })
            } else if (app.nameTeamActive == "4") {

                firebase.database().ref('Hurricanes').on('value', function (data) {

                    app.chatPrivate = document.getElementById("conversationPrivate");
                    app.chatPrivate.innerHTML = "";
                    var messages = data.val();

                    for (var key in messages) {
                        var line = document.createElement("div");
                        var text = document.createElement("p");
                        var people = document.createElement("p");
                        var element = messages[key];
                        if (element.name == app.logOk) {

                            text.setAttribute("class", "chatMeBackground ");
                            people.setAttribute("class", "chatMe");
                        } else {
                            text.setAttribute("class", "chatYouBackground");
                            people.setAttribute("class", "chatYou");
                        }


                        people.append(element.name);
                        people.append(":");

                        text.append(element.body);
                        line.append(people);
                        line.append(text);
                        app.chatPrivate.append(line);



                        var element = document.getElementById("conversationPrivate");
                        element.scrollIntoView(false);


                    }

                })
            }


            //            console.log("getting posts");
        },

        selectedChat: function () {
            let selectedEvent = event.target;
            app.window = selectedEvent.getAttribute("data-chat");

            if (app.window == "General") {
                app.chatWindow = true;
            }
            if (app.window == "Team") {
                app.chatWindow = false;
            }


        },

        /*
        /////////////
        pushNotificacions: function () {
            // Retrieve Firebase Messaging object.
            const messaging = firebase.messaging();
            // Add the public key generated from the console here.
            messaging.usePublicVapidKey("BP136mFuiHN74coYKnqz7MmyZAH6JPYTXY0o_ePH6Qxj7oJvG_j3bbOqg8o8aFBjSBgzB9uoVl103OH_TNC4cWM");

            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                // TODO(developer): Retrieve an Instance ID token for use with FCM.
                // ...
            }).catch(function (err) {
                console.log('Unable to get permission to notify.', err);
            });

            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.getToken().then(function (currentToken) {
                if (currentToken) {
                    sendTokenToServer(currentToken);
                    updateUIForPushEnabled(currentToken);
                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                    updateUIForPushPermissionRequired();
                    setTokenSentToServer(false);
                }
            }).catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
                showToken('Error retrieving Instance ID token. ', err);
                setTokenSentToServer(false);
            });

            // Callback fired if Instance ID token is updated.
            messaging.onTokenRefresh(function () {
                messaging.getToken().then(function (refreshedToken) {
                    console.log('Token refreshed.');
                    // Indicate that the new Instance ID token has not yet been sent to the
                    // app server.
                    setTokenSentToServer(false);
                    // Send Instance ID token to app server.
                    sendTokenToServer(refreshedToken);
                    // ...
                }).catch(function (err) {
                    console.log('Unable to retrieve refreshed token ', err);
                    showToken('Unable to retrieve refreshed token ', err);
                });
            });


        }
*/


    }

});