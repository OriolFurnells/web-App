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
		this.runWeb();
	},

	methods: {
		//función de arranque
		runWeb: function () {
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

		//función para extraer información
		extractInfo: function () {
			//Extraigo el nombre  del estadio y la dirección para el listado 
			for (let i = 0; i < app.teams.length; i++) {
				let stadium = app.teams[i].stadium;
				let direction = app.teams[i].adress;
				let addressComplete = stadium + " - " + direction;
				app.address.push(app.addressComplete);
			}

			//Extraigo la información de las jornadas
			for (let i = 0; i < app.matches.length; i++) {
				app.temporalInfo = app.matches[i].info;
				app.moreInfo2.push(app.temporalInfo);
			}
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

		},

		reset: function () {
			app.idTeamSelected = null;
			app.weekSelected = "";
		},
	
		selectedWindow: function () {
			let selectedEvent = event.target;
			// pendiente declarar general app.electionWindow;
			app.election = selectedEvent.getAttribute("data-option");
				app.matchesV = app.locationsList = app.chat = app.locationMap = app.menu = app.teamMenu= false;
			if (app.election == "menu") {
				app.menu = app.teamMenu = true; 
			} else if (app.election == "matches") {
				app.matchesV = app.teamMenu = true;
			} else if (app.election == "LocationList") {
				app.locationsList = true;
			} else if (app.election == "chat") {
				app.chat = true;
			}
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
						line.setAttribute("class", "chat");
					} else {
						text.setAttribute("class", "chatYouBackground");
						people.setAttribute("class", "chatYou");
						line.setAttribute("class", "chat");
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
				this.message = document.getElementById("messagePrivate").value;
				console.log(this.message)
				app.userNameChat = firebase.auth().currentUser.displayName;
				return firebase.database().ref(app.idTeamSelected).push({
					name: this.userNameChat,
					body: this.message
				});
		},

		PostsTeams: function (team) {
				firebase.database().ref(app.idTeamSelected).on('value', function (data) {

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
							line.setAttribute("class", "chat");
						} else {
							text.setAttribute("class", "chatYouBackground");
							people.setAttribute("class", "chatYou");
							line.setAttribute("class", "chat");
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

		printChat: function (message, conversation, idTeamSelected) {
			this.conversation();
			this.getPosts(idTeamSelected);
			document.getElementById("message").value = " ";
		},

	}

});