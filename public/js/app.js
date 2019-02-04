var app = new Vue({
    el: '#app',

    data: {
        //arrays que obtengo del jason
        info: [],
        teams: [],
        matches: [],
		//mensajes predefinidos
		needConexion: "Necesitas estar conectado para usar el chat",
        sendMessage: "Enviar un mensaje para ver la conversación",
        //variables que relleno mediante funciones
        temporalInfo: [],
        moreInfo2: [],
        election: "",
        window: "",
        idTeamSelected: null,
        teamStadium: [],
        weekSelected: "",
        teamLocation: "",
        address: [],
        dates: [],
        hours: [],
        chatPrivate: "",
        provider: "",
        message: "",
        userNameChat: "",
        logOk: "",

        //BOLEANOS 
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
			
        //¿?¿?¿? fncion por parametros pero no recuerdo para que
        option: function (array, teamSelected, change) {
            for (let i = 0; i < array.length; i++)
                if (Selected == array[i]) {
                    Change = Selected;
                }
        },

        //función para extraer información
        extractInfo: function () {
            //Extraigo el nombre  del estadio y la dirección para el listado 
            for (let i = 0; i < app.teams.length; i++) {
                let stadium = app.teams[i].stadium;
                let direction = app.teams[i].adress;
                let addressComplete = stadium + " - " + direction;
                app.address.push(app.addressComplete);
                //                console.log(app.addressComplete);
                //						console.log(app.moreInfo2)
            }

            //Extraigo la información de las jornadas
            for (let i = 0; i < app.matches.length; i++) {
                app.temporalInfo = app.matches[i].info;
                app.moreInfo2.push(app.temporalInfo);
            }
            //						console.log(app.moreInfo2)

            //Extraigo información concreta de todas las jornadas, PDTE CAMBIAR POR PARAMETROS PARA FECHA - HORA (para la ventana de MATCHES - MORE INFO)
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

        //funciona OK coge el valor del data attribute de options y  cambia el valor de los booleanos de v-show
        selectedWindow: function () {
            let selectedEvent = event.target;
            app.election = selectedEvent.getAttribute("data-option");
            
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
            app.idTeamSelected = null;
            app.weekSelected = "";
        },

        selectTeam: function () {
            let selectedTeam = event.target;
            app.idTeamSelected = selectedTeam.getAttribute("data-selectTeam");
            app.chatPrivate = document.getElementById("conversationPrivate");
            app.chatPrivate.innerHTML = "";
        },

        //Detecta equipo seleccionado y devuelve ID
        selectStadium: function () {
            let selected = event.target;
            app.teamLocation = selected.getAttribute("data-stadium");
            app.locationMap = true;
			app.teamStadium = [];
            for (let i = 0; i < app.teams.length; i++)
                if (app.teamLocation == app.teams[i].id) {
                    app.teamStadium = app.teams[i]
                }
            },

		selectedWeek: function () {
            let selectedTeam = event.target;
            app.weekSelected = "Semana " + selectedTeam.getAttribute("data-selectWeek");
        },
        
        //FUNCIONES CHAT
        login: function () {
            //documentación
            // https://firebase.google.com/docs/auth/web/google-signin
            // Provider
            this.provider = new firebase.auth.GoogleAuthProvider();
            // How to Log In
            firebase.auth().signInWithPopup(this.provider)
                .then(function () {
                    app.conected = true;
                    app.logOk = firebase.auth().currentUser.displayName;
                })
                .catch(function () {
                    alert("El usuario o la contraseña son erroneos");
                });
        },

        logout: function () {
            firebase.auth().signOut().then(function () {
                app.conected = false;
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
            this.message = document.getElementById("message").value;
            app.userNameChat = firebase.auth().currentUser.displayName;
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
						line.setAttribute("class","chat");
                    } else {
                        text.setAttribute("class", "chatYouBackground");
                        people.setAttribute("class", "chatYou");
						line.setAttribute("class","chat");
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
            if (app.idTeamSelected == "1") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                app.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Dracs").push({
                    name: this.userNameChat,
                    body: this.message
                });

            } else if (app.idTeamSelected == "2") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                this.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Voltors").push({
                    name: this.userNameChat,
                    body: this.message
                });
            } else if (app.idTeamSelected == "3") {
                this.message = document.getElementById("messagePrivate").value;
                console.log(this.message)
                this.userNameChat = firebase.auth().currentUser.displayName;
                return firebase.database().ref("Firebats").push({
                    name: this.userNameChat,
                    body: this.message
                });
            } else if (app.idTeamSelected == "4") {
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

            if (app.idTeamSelected == "1") {

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
							line.setAttribute("class","chat");
                        } else {
                            text.setAttribute("class", "chatYouBackground");
                            people.setAttribute("class", "chatYou");
							line.setAttribute("class","chat");
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

            } else if (app.idTeamSelected == "2") {

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
            } else if (app.idTeamSelected == "3") {

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
            } else if (app.idTeamSelected == "4") {

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
		
    }

});