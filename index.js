import puppeteer from "puppeteer";

(async () => {
    

    //Realizar login
    async function iniciarCuenta(web, page){
        await page.goto(web, { waitUntil: 'networkidle2'});

        //await page.setViewport()
        //const btnGestion = await page.$('[name="id05_05"]')
        //console.log(btnGestion);
        //await btnGestion.click();

        //Login
        const inputName = await page.$('[name="username"]')
        await inputName.click()
        await inputName.type('jf05_jvc')
        const inputPass = await page.$('[type="password"]')
        await inputPass.type('septiembre23')
        const btnAceptar = await page.$('[name="Aceptar"]')
        await btnAceptar.click()
        await page.waitForNavigation();
    }

    async function moverAbandejaDeActuaciones(page){
         //Ir a bandeja de entrada
         await page.goto('http://www.familia.pjud/SITFAWEB/TrmPendientesViewAccion.do?TipoTramite=2', {waitUntil: 'networkidle2'})
    }

    async function configurarBandeja(page){
        //Seleccionar todos radiobutton Todos
        const selectTodos = await page.$('[name="TIP_ConsultaL"]')
        selectTodos.click()
        //Seleccionar opción Converión UTM // cod: 385070 (value)
        await page.select('select[name="COD_NomenclaturaAct"]', '385070')

        console.log('status loading');
    }

    async function cargarActuaciones(page){
        //Realizar consulta
        const btnConsulta = await page.$('[name="irAccionTramitarT"]')
        btnConsulta.click()
        //await page.waitForSelector('#DivBloqueoPagina', {hidden: false});
        page.waitForNavigation({ timeout: 3000 })
    }


    try {
        const web = 'http://www.familia.pjud/SITFAWEB/jsp/Login/Login.jsp'
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const dataCausa = {tieneConv: false}
        
        await page.goto(web, { waitUntil: 'networkidle2'});

        //Login
        const inputName = await page.$('[name="username"]')
        await inputName.click()
        await inputName.type('jf05_jvc')
        const inputPass = await page.$('[type="password"]')
        await inputPass.type('septiembre23')
        const btnAceptar = await page.$('[name="Aceptar"]')
        await btnAceptar.click()
        await page.waitForNavigation();
        
        //Ir a bandeja de entrada
        await page.goto('http://www.familia.pjud/SITFAWEB/TrmPendientesViewAccion.do?TipoTramite=2', {waitUntil: 'networkidle2'})

        //Seleccionar todos radiobutton Todos
        const selectTodos = await page.$('[name="TIP_ConsultaL"]')
        selectTodos.click()
        //Seleccionar opción Converión UTM // cod: 385070 (value)
        await page.select('select[name="COD_NomenclaturaAct"]', '385070')

        //Realizar consulta
        const btnConsulta = await page.$('[name="irAccionTramitarT"]')
        await btnConsulta.click() 
        
        //obtener todas las tablas
        await page.waitForSelector('#div1 > table > tbody > tr') //:nth-child(1)
        const tablas = await page.$$('#div1 > table > tbody > tr > td > a')
        const tr01 = await page.$$('#div1 > table > tbody > tr') 

        /*tr01.forEach(async element => {
            const idtr01 = await (await element.getProperty('id')).toString().replace('JSHandle:', '')
            const tdtr01 = await element.$$('td')
            //let hreftr01;
            //console.log(tdtr01);
            const nametr01 = await (await tdtr01[2]?.getProperty('innerText')).toString().replace('JSHandle:', '') 
            
            console.log(nametr01);
            if(nametr01 != 'RIT'){
                const atr01 = await tdtr01[2].$('a')
                
                const hreftr01 = await (await atr01.getProperty('href')).toString().replace('JSHandle:', '')

                
                const causaID = '11531577' //para pruebas, ya tiene una conversion utm vigente //idtr01
                //console.log(hreftr01);
                await page.goto(`http://www.familia.pjud/SITFAWEB/IrPopUpCausaAccion.do?tipo_popUp=81&CRR_IdCausa=${idtr01}`, {waitUntil: 'networkidle2'})
                await page.waitForNavigation();
                //await iconoConvUTM.click()
                //console.log(await iconoConvUTM.toString());
        
                //Ver si tiene hay elementos en la tabla
                const convsUtm = await page.$$('table > tbody > tr')
        
                //console.log(convsUtm.length)
        
                if(convsUtm.length > 0){
                    //console.log('hay elementos en las conversiones utm');
                    //console.log('revisamos si hay VIGENTES');
                    convsUtm.forEach(async e => {
                        const el = await e.$$('td')
                        const estadoConversion = await (await el[3].getProperty('innerText')).toString().replace('JSHandle:', '')
                        //console.log(estadoConversion);
                        
                        if(estadoConversion === 'Vigente')
                            {
                                dataCausa.tieneConv = true
                                //console.log(estadoConversion);
                                //console.log('hay conversion vigente');
                                console.log(`${await nametr01} TIENE conversión UTM vigente`);
                            }else{
                                console.log(`${await nametr01} no tiene conversión UTM vigente`);
                            }
                            console.log('---------------------------------');
                        
                    })
                }else{
                    await page.goBack({waitUntil: 'networkidle2'})
                    //await page.goBack({waitUntil: 'networkidle2'})
                }
            }
        });*/

        
        for (let i = 1; i < tr01.length; i++) {
            //Actualiza tabla
            const updatetr01 = await page.$$('#div1 > table > tbody > tr')
            await page.waitForSelector('#div1 > table > tbody > tr > td > a')

            const idtr01 = await (await updatetr01[i].getProperty('id')).toString().replace('JSHandle:', '')
            const tdtr01 = await updatetr01[i].$$('td')
            
            const nametr01 = await (await tdtr01[2].getProperty('innerText')).toString().replace('JSHandle:', '') 
            const atr01 = await tdtr01[2].$('a') //(await tdtr01[3]?.getProperty('href')).toString().replace('JSHandle:', '')
            const hreftr01 = await (await atr01.getProperty('href')).toString().replace('JSHandle:', '') 

            console.log(`ID: ${idtr01}`);
            console.log(`RIT: ${nametr01}`);
        
            //Abrir historial de conversiones UTM
            const causaID = '11531577' //para pruebas, ya tiene una conversion utm vigente //idtr01
            await page.goto(`http://www.familia.pjud/SITFAWEB/IrPopUpCausaAccion.do?tipo_popUp=81&CRR_IdCausa=${idtr01}`, {waitUntil: 'networkidle2'})
            
            //Ver si tiene hay elementos en la tabla
            const convsUtm = await page.$$('table > tbody > tr')
    
            //console.log(convsUtm.length)
    
            if(convsUtm.length > 0){
                //console.log('hay elementos en las conversiones utm');
                //console.log('revisamos si hay VIGENTES');
                convsUtm.forEach(async e => {
                    const el = await e.$$('td')
                    const estadoConversion = await (await el[3].getProperty('innerText')).toString().replace('JSHandle:', '')
                    //console.log(estadoConversion);
                    
                    if(estadoConversion === 'Vigente')
                        {
                            dataCausa.tieneConv = true
                            //console.log(estadoConversion);
                            //console.log('hay conversion vigente');
                        }
                    
                })
            }else{
                //await page.goBack({waitUntil: 'networkidle2'})
                //await page.goBack({waitUntil: 'networkidle2'})
            }

            await page.goBack({waitUntil: 'networkidle2'})
            //Volver a tabla general de causa
            //await page.goBack({waitUntil: 'networkidle2'})
            //console.log('volvemos a tabla general de causa');
            
            //Si hay conversion vigente eliminar tramite si no realizar conversion
            if(dataCausa.tieneConv){
                console.log(`${await nametr01} TIENE conversión UTM vigente`);
            }else{
                console.log(`${await nametr01} no tiene conversión UTM vigente`);
            }
            
            console.log('---------------------------------');
        }


    } catch (error) {
        console.log(error);
    }
    
})();