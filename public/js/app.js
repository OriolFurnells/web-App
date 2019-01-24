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
		nameTeamActive: null,
		teamStadium: {},
		weekSelected: "",
		

		//id de paginas:
		menu: "",
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


		//------------------
		


		logoChange: "",
		
		weeks: [],

		dates: [],
		hours: [],
		
		
		urlMap: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.5634684217384!2d-0.9250836845654563!3d41.66782937923937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd596b5d2fc0bf7f%3A0x6d51881bdfa07f5b!2sCamino+de+Monzalbarba%2C+318%2C+50011+Zaragoza!5e1!3m2!1ses!2ses!4v1547733469527",
		address: [],
		favorite: false,
		dayNumber: 0,
		monthNumber: 0,
		year: 0,
		monthText: "",
		monthYear: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		dateText: [],

	},

	created: function () {
		this.start();

	},

	methods: {

		//función de arranque
		start: function () {
			fetch("https://api.myjson.com/bins/12sxs0", {
				method: "GET",
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				}
			}).then(function (json) {
				app.info = json;
				//				console.log(app.info);
				app.matches = app.info.matches;
				app.teams = app.info.teams;

				app.changeDate();
				app.extractInfo();


			}).catch(function (error) {
				console.log("Request failed:" + error.message);
			})
		},

		//función para convertir fecha numerica en texto, suprime 0 si van delatne OK--
		changeDate: function () {
			let month = "";
			let day = "";
			//			this.dates= "03/03/2018"
			for (let i = 0; i < this.dates.length; i++) {
				//this.dates = ;
				//				console.log(this.dates)
				day = this.dates[i].slice(0, 2);
				//				console.log(day)
				let dayFirst = day.slice(0, 1);

				if (dayFirst == "0") {
					this.dayNumber = this.dates[i].slice(1, 2);
				} else {
					this.dayNumber = this.dates[i].slice(0, 2);
				}

				//				console.log(this.dayNumber)

				month = this.dates[i].slice(3, 5);
				let monthFirst = month.slice(0, 1);

				if (monthFirst == "0") {
					this.monthNumber = this.dates[i].slice(4, 5);
				} else {
					this.monthNumber = this.dates[i].slice(3, 5);
				}

				this.year = this.dates[i].slice(6, 10);
				//				console.log(this.monthNumber)
				this.monthText = this.monthYear[this.monthNumber];
				//				console.log(this.monthText)

				let fecha = this.dayNumber + " de " + this.monthText + " del " + this.year;
				//				console.log(fecha);
				//			console.log(this.dateText)
				this.dateText.push(fecha);
			}
			//						console.log(this.dateText)

		},
		//¿?¿?¿
		option: function (array, teamSelected, change) {
			for (let i = 0; i < array.length; i++)
				if (Selected == array[i]) {
					Change = Selected;
				}

		},

		//obtengo información
		extractInfo: function () {
			//funciona OK -extraigo el nombre  del estadio y la dirección para el listado 
			for (let i = 0; i < app.teams.length; i++) {
				let stadium = app.teams[i].stadium;
				let direction = app.teams[i].adress;
				let addressComplete = stadium + " - " + direction;
				app.address.push(addressComplete);
			}

			//funciona OK - extraigo la información de las jornadas
			for (let i = 0; i < app.matches.length; i++) {
				app.temporalInfo = app.matches[i].info;
				app.moreInfo2.push(app.temporalInfo);
			}
						console.log(app.moreInfo2)

			//funciona OK - extraigo información concreta de todas las jornadas, PDTE CAMBIAR POR PARAMETROS PARA FECHA - HORA (para la ventana de MATCHES - MORE INFO)
			for (let k = 0; k < app.moreInfo2.length; k++) {
				for (let v = 0; v < app.moreInfo2[k].length; v++) {
					app.hours = app.moreInfo2[k][v].hour;
				}
			}
			
			for (let k = 0; k < app.moreInfo2.length; k++) {
				for (let v = 0; v < app.moreInfo2[k].length; v++) {
					app.dates = app.moreInfo2[k][v].date;
				}
			console.log(app.dates)
			}
			
			

			//pdte función de fecha
		},

		//		//funciona OK, marca el equipo PDTE fecha activos
				selectedWeek: function () {
					app.weekSelected = document.getElementById("date").value;
				},

		//funciona OK coge el valor del data attribute de options y  cambia el valor de los booleanos de v-show
		selectedWindow: function () {
			let selectedEvent = event.target;
			app.election = selectedEvent.getAttribute("data-option");
			console.log(app.election)
			
			if (app.election == "menu") {
				app.matchesV = false;
				app.locationsList = false;
				app.chat = false;
				app.menu = true;
				app.teamMenu = true;
				app.locationMap = false;

			} else if (app.election == "matches") {
				app.matchesV = true;
				app.locationsList = false;
				app.chat = false;
				app.menu = false;
				app.teamMenu = true;
				app.locationMap = false;
			} else if (app.election == "LocationList") {
				app.matchesV = false;
				app.locationsList = true;
				app.chat = false;
				app.menu = false;
				app.teamMenu = false;
				app.locationMap = false;
			} else if (app.election == "chat") {
				app.matchesV = false;
				app.locationsList = false;
				app.chat = true;
				app.menu = false;
				app.teamMenu = false;
			}
		},

		selectTeam: function () {
			let selectedTeam = event.target;
			app.nameTeamActive = selectedTeam.getAttribute("data-selectTeam");
			console.log(app.nameTeamActive)
		},

		//funciona, detecta equipo seleccionado y devuelve ID
		selectStadium: function () {
			let selected = event.target;
			app.nameTeamActive = selected.getAttribute("data-stadium");
			console.log(app.nameTeamActive);
			app.locationMap = true;
			console.log("hola")
			app.teamStadium = [];
			for (let i = 0; i < app.teams.length; i++)
				if (app.nameTeamActive == app.teams[i].id) {
					app.teamStadium = app.teams[i]
				}
			//				console.log(app.teamStadium);

		},

		//		stadium: function(){
		//		}

	},
});