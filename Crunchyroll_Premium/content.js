var HTML = document.documentElement.innerHTML;

//function que pega algo dentro dentro do html.
function pegaString(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null){
		return null;
	}else{
	    new_str = str.match(first_character + "(.*)" + last_character)[1].trim()
	    return(new_str)
    }
}
//función para cambiar el reproductor por uno más sencillo..
function importPlayer(){
		console.log("[CR Premium] Removiendo reproductor de Crunchyroll...");
		var elem = document.getElementById('showmedia_video_player');
    	elem.parentNode.removeChild(elem);

		console.log("[CR Premium] Obtención de datos de stream...");
		var video_config_media = JSON.parse(pegaString(HTML, "vilos.config.media = ", ";"));

    	console.log("[CR Premium] Añadiendo jwplayer...");
    	ifrm = document.createElement("iframe");
    	ifrm.setAttribute("id", "frame"); 
		ifrm.setAttribute("src", "https://mateus7g.github.io/crp-iframe-player/"); 
		ifrm.setAttribute("width","100%");
		ifrm.setAttribute("height","100%");
		ifrm.setAttribute("frameborder","0");
		ifrm.setAttribute("scrolling","no");
		ifrm.setAttribute("allowfullscreen","allowfullscreen");
		ifrm.setAttribute("allow","autoplay; encrypted-media *");

		if(document.body.querySelector("#showmedia_video_box") != null){
			document.body.querySelector("#showmedia_video_box").appendChild(ifrm);
		}else{
			document.body.querySelector("#showmedia_video_box_wide").appendChild(ifrm);
		}

		//Eliminar la nota de la parte superior sobre probar premium
		if (document.body.querySelector(".freetrial-note") != null) {
			console.log("[CR Premium] Eliminando la nota de Prueba Gratis...");
			document.body.querySelector(".freetrial-note").style.display = "none";
		}

		//Eliminar aviso que el video no puede ser visto
		if(document.body.querySelector(".showmedia-trailer-notice") != null){
			console.log("[CR Premium] Eliminando anuncio de trailer...");
			document.body.querySelector(".showmedia-trailer-notice").style.display = "none";
		}

		//Eliminar sugerencia de inscribirse para la prueba gratuita
		if(document.body.querySelector("#showmedia_free_trial_signup") != null){
			console.log("[CR Premium] Eliminando Inscripción a la prueba gratuita...");
			document.body.querySelector("#showmedia_free_trial_signup").style.display = "none";
		}

        // Simular la interacción del usuario para dejarlo en pantalla completa automáticamente
		var element = document.getElementById("template_scroller");
		if (element) element.click();
        
		const series = document.querySelector('meta[property="og:title"]');
		const up_next = document.querySelector('link[rel=next]');
		chrome.storage.sync.get(['aseguir', 'cooldown'], function(items) {
			ifrm.onload = function(){
				ifrm.contentWindow.postMessage({
           			'video_config_media': [JSON.stringify(video_config_media)],
				   	'lang': [pegaString(HTML, 'LOCALE = "', '",')],
				   	'series': series ? series.content : undefined,
				   	'up_next': up_next ? up_next.href : undefined,
				   	'up_next_cooldown': items.cooldown === undefined ? 5 : items.cooldown,
				   	'up_next_enable': items.aseguir === undefined ? true : items.aseguir,
				   	'version': "1.0.3"
        		},"*");
			};
		});

		//console.log(video_config_media);
}
//función al cargar la página.
function onloadfunction() {
	if(pegaString(HTML, "vilos.config.media = ", ";") != null){
		importPlayer();
	}
}
document.addEventListener("DOMContentLoaded", onloadfunction());
