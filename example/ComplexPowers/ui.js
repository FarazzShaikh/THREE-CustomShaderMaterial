//=============================================
//Imports from lib/
//=============================================


import {
    GUI
} from '../lib/dat.gui.module.js';

//=============================================
//Imports from My Code
//=============================================

//NONE HERE



//=============================================
//Variables Defined in this File
//=============================================




let ui = {

    AboutThis: function(){
        window.open('./about.html');
    },

    rotx:0,
    roty:0,
    rotu:0,
    tumble: 0.2,
    grid:0.5,
    hue:1,

    n:-1,
    baseRad:4.,

    proj:2,
    transmission:0.,
    
};






//=============================================
//Functions to Export
//=============================================


function createUI() {

    let mainMenu = new GUI();

    mainMenu.width = 300;
    mainMenu.domElement.style.userSelect = 'none';
    mainMenu.add(ui, 'AboutThis').name("Help/About");


    mainMenu.add(ui,'n',-7,7,1).name('Degree');
    mainMenu.add(ui,'baseRad',1,10,0.01).name('Domain Size');

    let more = mainMenu.addFolder('More');
        more.add(ui,'grid',0,1,0.01).name('grid');
        more.add(ui,'hue',0,1,0.01).name('hue');
        more.add(ui,'transmission',0,1,0.01);

        // more.add(ui,'tumble',0,1,0.01).name('tumble');
        more.add(ui,'rotx',0,1,0.01).name('rotx');
        more.add(ui,'roty',0,1,0.01).name('roty');
        more.add(ui,'rotu',0,1,0.01).name('rotu');

        more.add(ui, 'proj', {
        'Stereographic': 0,
        'Perspective': 1,
            'Orthographic': 2
    }).name('Projection');

    more.close();
}



//=============================================
//Exports from this file
//=============================================


export {
    ui,
    createUI
};
