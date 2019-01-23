wheel = new wheelnav('wheelDiv');
wheel.spreaderInTitle = '/images/fefa.png';
wheel.spreaderOutTitle = '/images/fefa.png';

wheel.colors = ['#EDC951'];
wheel.spreaderEnable = true;
wheel.spreaderRadius = 85;
wheel.slicePathFunction = slicePath().DonutSlice;
wheel.clickModeRotate = false;
wheel.createWheel(['menu', 'partidos', 'locations', 'chat', null, null, null, null, null, null, null, null, null, null, null, null]);