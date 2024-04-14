const remove_sc_reg = /[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g
let current_algo 
let last_color_in_palette

function add_new_color(){
  const random_color = random_hex_color()
  const elms = []
  let to_gen_algo = current_algo
  let to_base_color = last_color_in_palette
  let palette
  if(current_algo == "triadic" || current_algo == "tetradic" || current_algo == "complementary" ){
    to_gen_algo = "random"
    to_base_color = random_color
    palette = generate_palette(to_base_color, 1, to_gen_algo)
  } else {
    palette = generate_palette(to_base_color, 2, to_gen_algo).splice(1,1)
  }
  Array.from(palette).forEach((a) => {
	const child = []
	Array.from(a).forEach((c, i) => {
		const color = hsl2hex(c[0],c[1],c[2])
	        const intensity = i === 0 ? 50 : i * 100  
		child.push(`
			<span
			style="
			background:${color};
			color:${c[2] >= 50 ? "#000000" : "#FFFFFF" };
			"
			class="md:rounded-md h-[100px] w-[8.5%]
			p-2 color-span flex flex-col justify-center items-center 
			cursor-pointer relative
		        hover:brightness-105
			font-bold
			"
			title="Copy ${color}"
			data-color="${color};${intensity}"
			onclick="copy2clipboard('${color}',this)"
			>
			<span class="hidden md:block
			bg-transparent opacity-50 contrast-200 brightness-200">${intensity}</span>
			<span class="hidden md:block bg-transparent opacity-50 contrast-200 brightness-200">
			  ${color}
			</span>
			</span>
		  `)
	  })
        const color_hex_ = String(child[5])
	      .split("background")[1]
	      .split(";")[0].replace(":","")
        const color_title_ = color_title(color_hex_)
       const color_title_id = color_title_
       .replace( remove_sc_reg, '-').toLowerCase()
       .replace("’s",'s')
       .replace("’t",'t')
	  elms.push(`
	  <div class="flex flex-col mb-8">
	    <div class="text-md md:text-2xl font-semibold mb-5 flex w-full justify-between">
	      <div class="flex justify-between items-center w-full">
		<div>
		  <span contenteditable
		    onkeydown="event.key == 'Enter' ? event.preventDefault() : '' ;"
		    spellcheck="false"
		    class="focus:outline-none focus:border-b-2 border-blue-500"
		    id="${color_title_id}-input-span"
		    data-color="${color_hex_}"
		    data-original="${color_title_}"
		    data-edited=""
		    oninput="this.dataset.edited = this.textContent"
		    >${color_title_.trim()}</span>
		  <button class="ml-2 text-slate-400 hover:text-slate-300"
		  onclick="document.querySelector('#${color_title_id}-input-span').focus();
		    move_cursor2end(document.querySelector('#${color_title_id}-input-span'))">
		    <i class="fa-solid fa-pen"></i>
		  </button>
		</div>
		<div class="flex space-x-3 items-center text-slate-400 relative">
			<button class="hover:text-slate-300 relative">
			  <i class="fa-solid fa-sliders"></i>
			  <input type="color" id="temp_c" class="absolute
			   z-10 left-0 top-0 w-[25px] opacity-0
			   cursor-pointer"
			   value="${color_hex_}"
			   onchange="
			   edit_color_tone(
			   document.querySelector('#group-${color_title_id}').parentElement,
			   this
			   )"
			   />
			</button>
			<button
			onclick="
			document.querySelector('#group-${color_title_id}').previousSibling.parentElement.remove()
			"
			class="hover:text-slate-300">
			  <i class="fa-solid fa-trash"></i>
			</button>
		</div>
	      </div>
	    </div>
	   <div id="group-${color_title_id}" class="flex mb-2 flex-wrap md:justify-between items-center">
	      ${child.join("")}
	    </div>
	  </div>
	    `)
	})
  document.querySelector("#color-palette-list")
    .insertAdjacentHTML("beforeend",`${elms.join("")}`)
  scroll2bottom(
    document.querySelector('#palette-tab-body').parentElement
  )
}

function edit_color_tone(elm,trigger){
  elm.innerHTML = ""
  const hex = trigger.value
  const elms = []
  const palette = generate_palette(hex, 1)
  Array.from(palette).forEach((a) => {
	const child = []
	Array.from(a).forEach((c, i) => {
		const color = hsl2hex(c[0],c[1],c[2])
	        const intensity = i === 0 ? 50 : i * 100  
		child.push(`
			<span
			style="
			background:${color};
			color:${c[2] >= 50 ? "#000000" : "#FFFFFF" };
			"
			class="md:rounded-md h-[100px] w-[8.5%]
			p-2 color-span flex flex-col justify-center items-center 
			cursor-pointer relative
		        hover:brightness-105
			font-bold
			"
			title="Copy ${color}"
			data-color="${color};${intensity}"
			onclick="copy2clipboard('${color}',this)"
			>
			<span class="hidden md:block
			bg-transparent opacity-50 contrast-200 brightness-200">${intensity}</span>
			<span class="hidden md:block bg-transparent opacity-50 contrast-200 brightness-200">
			  ${color}
			</span>
			</span>
		  `)
	  })
        const color_hex_ = String(child[5])
	      .split("background")[1]
	      .split(";")[0].replace(":","")
        const color_title_ = color_title(color_hex_)
       const color_title_id = color_title_
       .replace( remove_sc_reg, '-').toLowerCase()
       .replace("’s",'s')
       .replace("’t",'t')
	  elms.push(`
	    <div class="text-md md:text-2xl font-semibold mb-5 flex w-full justify-between">
	      <div class="flex justify-between items-center w-full">
		<div>
		  <span contenteditable
		    onkeydown="event.key == 'Enter' ? event.preventDefault() : '' ;"
		    spellcheck="false"
		    class="focus:outline-none focus:border-b-2 border-blue-500"
		    id="${color_title_id}-input-span"
		    data-color="${color_hex_}"
		    data-original="${color_title_}"
		    data-edited=""
		    oninput="this.dataset.edited = this.textContent"
		    >${color_title_.trim()}</span>
		  <button class="ml-2 text-slate-400 hover:text-slate-300"
		  onclick="document.querySelector('#${color_title_id}-input-span').focus();
		    move_cursor2end(document.querySelector('#${color_title_id}-input-span'))">
		    <i class="fa-solid fa-pen"></i>
		  </button>
		</div>
		<div class="flex space-x-3 items-center text-slate-400 relative">
			<button class="hover:text-slate-300 relative">
			  <i class="fa-solid fa-sliders"></i>
			  <input type="color" id="temp_c" class="absolute
			   z-10 left-0 top-0 w-[25px] opacity-0
			   cursor-pointer"
			   value="${color_hex_}"
			   onchange="
			   edit_color_tone(
			   document.querySelector('#group-${color_title_id}').parentElement,
			   this
			   )"
			   />
			</button>
			<button
			onclick="
			document.querySelector('#group-${color_title_id}').previousSibling.parentElement.remove()
			"
			class="hover:text-slate-300">
			  <i class="fa-solid fa-trash"></i>
			</button>
		</div>
	      </div>
	    </div>
	   <div id="group-${color_title_id}" class="flex mb-2 flex-wrap md:justify-between items-center">
	      ${child.join("")}
	    </div>
	    `)
	})
  elm.insertAdjacentHTML("beforeend",`${elms.join("")}`)
}

function display_palette(palette,type,delete_previous = true){
  if(document.querySelector(".message-no-palette")) document
    .querySelector(".message-no-palette").classList.add("hidden")
  if(delete_previous) document.querySelector("#palette-view").innerHTML = ""
  const elm = []	
  Array.from(palette).forEach((a) => {
	const child = []
	Array.from(a).forEach((c, i) => {
		const color = hsl2hex(c[0],c[1],c[2])
	        const intensity = i === 0 ? 50 : i * 100  
		child.push(`
			<span
			style="
			background:${color};
			color:${c[2] >= 50 ? "#000000" : "#FFFFFF" };
			"
			class="md:rounded-md h-[100px] w-[8.5%]
			p-2 color-span flex flex-col justify-center items-center 
			cursor-pointer relative
		        hover:brightness-105
			font-bold
			"
			title="Copy ${color}"
			data-color="${color};${intensity}"
			onclick="copy2clipboard('${color}',this)"
			>
			<span class="hidden md:block
			bg-transparent opacity-50 contrast-200 brightness-200">${intensity}</span>
			<span class="hidden md:block bg-transparent opacity-50 contrast-200 brightness-200">
			  ${color}
			</span>
			</span>
		  `)
	  })
        const color_hex_ = String(child[5])
	      .split("background")[1]
	      .split(";")[0].replace(":","")
        const color_title_ = color_title(color_hex_)
       const color_title_id = color_title_
       .replace( remove_sc_reg, '-').toLowerCase()
       .replace("’s",'s')
       .replace("’t",'t')
	  elm.push(`
	  <div class="flex flex-col mb-8">
	    <div class="text-md md:text-2xl font-semibold mb-5 flex w-full justify-between">
	      <div class="flex justify-between items-center w-full">
		<div>
		  <span contenteditable
		    onkeydown="event.key == 'Enter' ? event.preventDefault() : '' ;"
		    spellcheck="false"
		    class="focus:outline-none focus:border-b-2 border-blue-500"
		    id="${color_title_id}-input-span"
		    data-color="${color_hex_}"
		    data-original="${color_title_}"
		    data-edited=""
		    oninput="this.dataset.edited = this.textContent"
		    >${color_title_.trim()}</span>
		  <button class="ml-2 text-slate-400 hover:text-slate-300"
		  onclick="document.querySelector('#${color_title_id}-input-span').focus();
		    move_cursor2end(document.querySelector('#${color_title_id}-input-span'))">
		    <i class="fa-solid fa-pen"></i>
		  </button>
		</div>
		<div class="flex space-x-3 items-center text-slate-400 relative">
			<button class="hover:text-slate-300 relative">
			  <i class="fa-solid fa-sliders"></i>
			  <input type="color" id="temp_c" class="absolute
			   z-10 left-0 top-0 w-[25px] opacity-0
			   cursor-pointer"
			   value="${color_hex_}"
			   onchange="
			   edit_color_tone(
			   document.querySelector('#group-${color_title_id}').parentElement,
			   this
			   )"
			   />
			</button>
			<button
			onclick="
			document.querySelector('#group-${color_title_id}').previousSibling.parentElement.remove()
			"
			class="hover:text-slate-300">
			  <i class="fa-solid fa-trash"></i>
			</button>
		</div>
	      </div>
	    </div>
	   <div id="group-${color_title_id}" class="flex mb-2 flex-wrap md:justify-between items-center">
	      ${child.join("")}
	    </div>
	  </div>
	    `)
	})
	document.querySelector("#palette-view").insertAdjacentHTML("beforeend", `
	  	<div class="p-4 flex flex-col">
			<div class="text-slate-200 font-semibold 
	 		   md:mb-1 mb-5 flex md:justify-end justify-start flex-wrap">
			   <div class="relative">
			       <button class="p-2 bg-blue-600 rounded-md px-4 hover:bg-blue-700 m-2"
			       onclick="
				 document.querySelector('#export-menu').classList.toggle('hidden');
				 document.querySelector('#export-menu > button').focus();
			       ">
				     <i class="fa-solid fa-file-export"></i> Export
				</button>
				<div class="flex flex-col absolute z-10 top-[50px] left-[-5px] hidden"
				  id="export-menu"
				  >
					<button class="p-2 px-6 bg-gray-700 rounded-t-md
					hover:brightness-150 focus:brightness-150" 
					onclick="export_palette('css')" 
					>
					<i class="fa-brands fa-css3-alt"></i>	CSS
					</button>
					<button class="p-2 px-6 bg-gray-700
					hover:brightness-150 focus:brightness-150"
					onclick="export_palette('scss')" 
					>
					 <i class="fa-brands fa-sass"></i> SASS
					</button>
					<button class="p-2 px-6 bg-gray-700
					hover:brightness-150 focus:brightness-150 "
					onclick="export_palette('less')" 
					>
					 <i class="fa-brands fa-less"></i> Less
					</button>
					<button class="p-2 px-6 bg-gray-700 rounded-b-md 
					hover:brightness-150 focus:brightness-150 flex space-x-2 text-sm"
					onclick="export_palette('tailwind')" 
					>
					  <i class="fa-solid fa-code"></i> 
					  <span>Tailwind</span>
					</button>
				</div>
			   </div>
				 <button 
				 onclick="save_palette(this)"
				 class="p-2 bg-blue-600 rounded-md px-4 hover:bg-blue-700 m-2">
				      <i class="fa-solid fa-bookmark"></i> Save
				</button>
			</div>
			   <div class="text-lg md:text-3xl mb-5 md:mb-10 capitalize font-semibold">
			      <span contenteditable
			        onkeydown="event.key == 'Enter' ? event.preventDefault() : '' ;"
	 			spellcheck="false"
	 			class="focus:outline-none focus:border-b-2 border-blue-500"
	 			id="algorithm-input-span">
				${type.trim()}</span>
			      <button class="ml-2 text-slate-400 hover:text-slate-300"
			      onclick="document.querySelector('#algorithm-input-span').focus();
				move_cursor2end(document.querySelector('#algorithm-input-span'))">
				<i class="fa-solid fa-pen"></i>
			      </button>
			    </div>
			<div class="flex flex-col mb-5" id="color-palette-list">
				${elm.join("")}
			</div>
			<div class="flex justify-center w-full items-center mb-10">
			  <button class="p-2 px-4 font-semibold text-lg
			  bg-blue-600 hover:bg-blue-700 rounded-md "
			  onclick="add_new_color()"
			  >
			      <i class="fa-regular fa-square-plus"></i> Add ${type == 'tetradic' || type === 'triadic' || type == 'complementary' ? 'Random' : '' } Color
			  </button>
			</div>
		</div>
	  `)
}

function generate_palette(base_color, num, scheme = "analogous") {
    const base_hsl = hex2hsl(base_color);
    if(base_hsl.s < 10){
      base_hsl.s = Math.floor(Math.random() * (30 - 10) + 10)
    }
    current_algo = scheme
    const palette = [];
    let angle;
    switch (scheme) {
        case "triadic":
            angle = 120;
            break;
        case "complementary":
            angle = 180;
            break;
        case "analogous":
            angle = 30;
            break;
        case "tetradic":
            angle = 90;
            break;
        case "neutral":
            angle = 15;
            break;
        case "random":
            angle = Math.floor(Math.random() * 360);
            break;
        case "compound":
            angle = 60;
            break;
        case "split_complementary":
            angle = 150;
            break;
        default:
            angle = "random";
            break;
    }

    for (let i = 0; i < num; i++) {
        if (angle === "random") angle = Math.floor(Math.random() * 360);
        const new_hue = (base_hsl.h + angle * i) % 360;
        const _tone = [];
        for (let j = 1; j <= 10; j++) {
	    let lum = j * 10
	    if(j == 10) lum = 95
            const new_color = [
                new_hue,
                base_hsl.s,
                lum
            ];
            _tone.push(new_color);
        }
        palette.push(_tone.reverse());
    }
    last_color_in_palette = hsl2hex(
      palette[palette.length - 1][5][0],
      palette[palette.length - 1][5][1],
      palette[palette.length - 1][5][2],
    )
    return palette;
}

function color_title(hex){
  const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
  const nearest = nearestColor.from(colors);
  return nearest(hex).name;
}

function hex2hsl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min){
        h = s = 0; 
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    h = Math.round(h*360);
    s = Math.round(s*100);
    l = Math.round(l*100);

    return { h, s, l };
}

function hsl2hex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const tab_list = [
  "generate","palette","preview","info","saved"
]

function show_tab(tab){
	tab_list.forEach((e) => {
	  if(tab == e){
		document.querySelector(`#${e}-tab-body`).classList.remove("hidden")
		document.querySelector(`#${e}-tab-button`).classList.add("bg-gray-800")
	  } else {
		document.querySelector(`#${e}-tab-body`).classList.add("hidden")
		document.querySelector(`#${e}-tab-button`).classList.remove("bg-gray-800")
	  }
	})
}

function random_hex_color() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + randomColor.padStart(6, '0');
}

function check_valid_hex_color(color, elm) {
  const hexColorRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  if(hexColorRegex.test(color)){
	document.getElementById('input-color-picker').value = elm.value
	document.getElementById('span-color-picker').style.background = elm.value
  }
}

function generate_(){
  const loader =  document.querySelector("#loading-screen")
  loader.classList.remove("hidden")
  const color_hex =  document.querySelector("#input-color-picker").value
  const generation_param = document.querySelector("#generation-type-selector").value.split(";")
  const palette = generate_palette(color_hex, generation_param[0], generation_param[1])
  show_tab("palette")
  display_palette(palette, generation_param[1])
  loader.classList.add("hidden")
}

function copy2clipboard(text, elm){
  if(document.querySelector("#c_msg")) document.querySelector("#c_msg").remove()
   navigator.clipboard.writeText(text)
  .then(e => {
    elm.insertAdjacentHTML("beforeend",`
	<span id="c_msg" class="absolute 
	top-0 right-2 text-sm font-semibold pt-1 
        bg-transparent opacity-50 contrast-200 brightness-200">
	      <i class="fa-solid fa-check"></i>
	</span>
      `)
    setTimeout(() => {
      if(document.querySelector("#c_msg")) document.querySelector("#c_msg").remove()
    },3000)
  }).catch(e => {
    console.log({ERROR:e})
  })
}

function move_cursor2end (contentEle){
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(contentEle, contentEle.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
};

function change_random_color(){
    const random_color = random_hex_color()
    document.querySelector("#input-color-picker").value = random_color
    document.querySelector("#span-color-picker").style.background = random_color
    document.querySelector("#input-color-text").value = random_color
}

function scroll2bottom(element) {
  element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
}

function extract_serialize_color(){
  const base_ = document.querySelectorAll("#color-palette-list > div")
  const palette_json = {}
  base_.forEach(e => {
    const target_color_name = e.querySelector("span[contenteditable]").id.replace("-input-span","")
    let color_name = e.querySelector("span[contenteditable]").dataset.original
      .toLowerCase().replace(remove_sc_reg,"_")
      .replace("’s",'s')
      .replace("’t",'t')
    if(e.querySelector("span[contenteditable]").dataset.edited.length > 2){
      color_name = e.querySelector("span[contenteditable]").dataset.edited
	.toLowerCase().replace(remove_sc_reg,"_")
	.replace("’s",'s')
	.replace("’t",'t')
    }
      palette_json[`${color_name}`] = {}
      document.querySelectorAll(`#group-${target_color_name} > span`).forEach(s => {
		const hex_color = s.dataset.color.split(";")[0]
		const intensity = s.dataset.color.split(";")[1]
		palette_json[`${color_name}`][`${intensity}`] = hex_color
      })
  })
    return { 
      json_ : palette_json, 
      array_ : convert_json2array(palette_json), 
      css: convert_json2css_variable(palette_json),
      scss: convert_json2css_variable(palette_json,"$"),
      less: convert_json2css_variable(palette_json,"@")
    }
}

function convert_json2array(json) {
  const hslArray = [];
  for (const color in json) {
    const colorShades = json[color];
    const colorHSLArray = [];
    for (const shade in colorShades) {
      const hex = colorShades[shade];
      const hsl = hex2hsl(hex);
      colorHSLArray.push([hsl.h,hsl.s,hsl.l]);
    }
    hslArray.push(colorHSLArray);
  }
  return hslArray;
}

function convert_json2css_variable(json,prefix="--") {
  const cssVariables = [];
  for (const color in json) {
    const shades = json[color];
    for (const shade in shades) {
      const variableName = `${prefix}${color.replaceAll("_","-")}-${shade}`;
      const variableValue = shades[shade];
      const cssVariable = `${variableName}: ${variableValue};`;
      cssVariables.push(cssVariable);
    }
  }
  return cssVariables;
}

function download_file(fileName, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = "none";
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function save_palette(elm){
  const pallete_name = document.querySelector("#algorithm-input-span").textContent
    .toLowerCase().trim().replace(remove_sc_reg,"_")
    .replace("’s",'s')
    .replace("’t",'t')
  const palette = extract_serialize_color().array_
  if(localStorage.getItem('palette') == null){
    localStorage
	.setItem('palette', JSON.stringify([{ name : `${pallete_name}_${crypto.randomUUID().slice(0,3)}`,  palette }]))	 
  } else {
        const prev_state = JSON.parse(localStorage.getItem('palette'))
    	prev_state.push({
	name : `${pallete_name}_${crypto.randomUUID().slice(0,3)}`,  palette 
      })
    localStorage.setItem('palette', JSON.stringify(prev_state))
  }
    elm.disabled = true
    elm.style.cursor = "not-allowed"
    elm.style.filter = "brightness(0.85)"
    elm.innerHTML = `<i class="fa-solid fa-bookmark"></i> Saved`
}

function fetch_saved_palette(){
      if(localStorage.getItem('palette') !== null && JSON.parse(localStorage.getItem('palette')).length > 0 ){
  	document.querySelector("#saved-palette-list").innerHTML = ''
  	document.querySelector("#saved-palette-list").classList.remove("h-full")
  	document.querySelector("#saved-palette-list").classList.add("h-auto")
	const data = JSON.parse(localStorage.getItem('palette'))
  	document.querySelector("#saved-palette-list").classList.remove('justify-center')
  	document.querySelector("#saved-palette-list").classList.remove('items-center')
  	const child = []
  	data.forEach((e,i) => {
	  child.push(`
		<div class="p-2 rounded-md bg-gray-700 flex 
		  flex-wrap space-x-3 justify-between md:justify-between items-center md:w-1/6 w-full m-2">
		    <span class="text-xl capitalize">${e.name.replaceAll("_"," ")}</span>
		    <div class="flex items-center space-x-2">
		      <button class="hover:text-slate-300 relative"
		      onclick="view_saved(this)" data-saved='${JSON.stringify(e)}'>
			    <i class="fa-solid fa-sliders"></i>
			</button>
		      <button class="hover:text-slate-300 relative"
		      onclick="delete_saved(${i})">
			    <i class="fa-solid fa-trash"></i>
			</button>
		    </div>
		</div>
	    `)
	})
  	document.querySelector("#saved-palette-list").insertAdjacentHTML('beforeend', `
		<div class="p-4 flex flex-wrap w-full justify-start">
		    ${child.reverse().join("")}
		</div> 	
	  `)
	}
}

function view_saved(elm){
  const loader =  document.querySelector("#loading-screen")
  const palette = JSON.parse(elm.dataset.saved)
  loader.classList.remove("hidden")
  show_tab("palette")
  display_palette(
    palette.palette,
    palette.name.replaceAll("_"," ").slice(0,palette.name.replaceAll("_"," ").length - 4))
  loader.classList.add("hidden")
}

function delete_saved(index){
	let data = JSON.parse(localStorage.getItem('palette'))
  	data.splice(index,1)
	localStorage.setItem('palette', JSON.stringify(data))
	fetch_saved_palette()
	data = JSON.parse(localStorage.getItem('palette'))
	if(data.length <= 0 ){
  	document.querySelector("#saved-palette-list").innerHTML = ''
  	document.querySelector("#saved-palette-list").classList.add('justify-center')
  	document.querySelector("#saved-palette-list").classList.add('items-center')
  	document.querySelector("#saved-palette-list").insertAdjacentHTML('beforeend', `
	    <p>
	      No Saved Palette Found!
	    </p>
	  `)
	}
}

function export_palette(type){
  document.querySelector('#export-menu').classList.toggle('hidden')
  const data = extract_serialize_color()
  let content
  switch (type) {
  	case "css":
  		content = data.css
  		break;
  	case "scss":
  		content = data.scss
  		break;
  	case "less":
  		content = data.less
  		break;
  	case "tailwind":
  		content = data.json_
  		break;
  	default:
  		content = data.css
  		break;
  }
  if(type == "tailwind"){
    content = JSON.stringify(content,null, "\t")
    content = `const colors = ${content}`
  } else {
    content = content.join("\n")
  } 
  document.querySelector('body').insertAdjacentHTML("beforeend", `
  	<dialog
	id="export-menu-final"
	class="text-slate-300
	absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/90">
	  <div class="flex flex-col rounded-md relative p-4 bg-gray-800">
		  <button class="absolute -top-2 -right-2 text-2xl text-slate-400 hover:text-rose-500"
		  onclick="document.querySelector('#export-menu-final').remove()">
		      <i class="fa-solid fa-circle-xmark"></i>
		  </button>
	  	<span class="capitalize mb-2 text-xl">Export: ${type}</span>
		<textarea class="p-2 h-[150px] w-[250px] md:w-[300px] rounded-md
		bg-gray-700 text-slate-300 resize-none" id="export-textarea"
		spellcheck="false">${content}</textarea>
		<div class="flex space-x-3 justify-between items-center mb-2 mt-5">
		  <button class="p-1 px-2 rounded-md 
		   bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
		   onclick='sanitize_download_copy("${type}","copy",
		   document.querySelector("#export-textarea").value)'
		   >
		    Copy <i class="fa-solid fa-copy"></i>
		  </button>
		  <button class="p-1 px-2 rounded-md 
		   bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
		   onclick='sanitize_download_copy("${type}","download",
		   document.querySelector("#export-textarea").value)'
		   >
		     Download <i class="fa-solid fa-download"></i>
		  </button>
		</div>
	  </div>
      </dialog>
    `)
  document.querySelector("#export-textarea").focus()
}

function sanitize_download_copy(type,action,content){
  if(action == "download"){
    download_file(type == "tailwind" ? `colors.js` : `color.${type}`, `${content}`)
  } else {
    navigator.clipboard.writeText(`${content}`)
      .then(e => {
	document.querySelector('body')
	.insertAdjacentHTML("beforeend",`
	    <span id="c_msg" class="absolute 
	    top-0 text-sm font-semibold pt-1 
	    flex justify-center items-center
	    text-slate-300 w-full mt-2 opacity-90">
	      <span class="bg-gray-900 rounded-md p-2">
		  <i class="fa-solid fa-check"></i> Copied!
	      </span>
	    </span>
	  `)
	setTimeout(() => {
	  if(document.querySelector("#c_msg")) document.querySelector("#c_msg").remove()
	},3000)
      }).catch(e => {
	console.log({ERROR:e})
      })
  }
    document.querySelector("#export-menu-final").remove()
}

function change_preview_color_mode(button){
      document.querySelectorAll('.color-mode').forEach((e) => {
	if(e.classList.contains("bg-slate-900")){
	    e.classList.remove("bg-slate-900")
	    e.classList.remove("text-slate-300")
	    e.classList.add("bg-white")
	    e.classList.add("text-slate-900")
	    localStorage.setItem('preview_theme', 'light')
	    button.innerHTML = `<i class="fa-solid fa-moon"></i>`
	  } else {
	    e.classList.remove("bg-white")
	    e.classList.remove("text-slate-900")
	    e.classList.add("bg-slate-900")
	    e.classList.add("text-slate-300")
	    localStorage.setItem('preview_theme', 'dark')
	    button.innerHTML = `<i class="fa-solid fa-sun"></i>`
	  }
      })
}

function render_preview(){
  const color_palette = extract_serialize_color().array_
  const rand_col = () => {
    const random = Math.floor(Math.random() * color_palette.length)
    const random_color = color_palette[random][4]
    return [random_color[0],random_color[1],random_color[2]]
  }
  if(color_palette.length > 0){
    if(localStorage.getItem('preview_theme') == null || localStorage.getItem('preview_theme').length <= 0){
	localStorage.setItem('preview_theme', 'dark')
    }
    document.querySelector("#preview-tab-body").innerHTML = ""
    const control_buttons = `
	  <div class="bg-gray-900 flex 
	  justify-center
	  items-center md:pr-5 text-xl">
		  <button class="m-2 hover:text-slate-400 "
		  onclick="render_preview()">
		      <i class="fa-solid fa-dice"></i>
		  </button>
		  <button class="m-2 hover:text-slate-400 "
		  onclick="change_preview_color_mode(this)">
		      <i class="fa-solid fa-sun"></i>
		  </button>
	  </div>
    `
    const nav = `
      <span class="m-2 text-xl font-semibold px-2">
	    Navbar 
	</span>
	<div class="px-4 p-2">
	<div 
	class="flex p-2 justify-between items-center cursor-pointer"
    	style="color:${hsl2hex(...rand_col())}>
		<button>
			<i class="fa-solid fa-bars"></i>
		</button>
		<div class="flex space-x-2 font-semibold">
		  <span>Home</span>
		  <span>About</span>
		  <span>Content</span>
		</div>
	</div>
	<div class="flex p-2 justify-between items-center cursor-pointer"
	  style="background:${hsl2hex(...rand_col())};color:#0f0f0f"
	>
		<button>
			<i class="fa-solid fa-bars"></i>
		</button>
		<div class="flex space-x-2 font-semibold">
		  <span>Home</span>
		  <span>About</span>
		  <span>Content</span>
		</div>
	</div>
	</div>
    `
    const button_child =[]
    color_palette.forEach((b) => {
      button_child.push(
	`<button style="background:${hsl2hex(b[4][0], b[4][1], b[4][2])}"
	  class="px-4 p-2 rounded-md m-2"
	>
	      <span style="color:#0f0f0f">
		  Button
	      </span>
	</button>`
      )
    })
    const buttons = `
      <span class="m-2 text-xl font-semibold px-2">
	    Button 
	</span>
	<div class="px-4 p-2 flex flex-wrap justify-start">
		${button_child.join("")}
	</div>
    `
    const text_child = []
      color_palette.forEach((b) => {
	text_child.push(
	  `
	  <div class="px-2 flex justify-start items-center flex-wrap">
	    <span class="m-2" style="color:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	    Normal Text!
	    </span>
	    <b class="m-2" style="color:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	    Bold Text!
	    </b>
	    <i class="m-2" style="color:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	    Italic Text!
	    </i>
	    <u class="m-2" style="color:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	     Underline Text!
	    </u>
	    <s class="m-2" style="color:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	      Strike!
	    </s>
	    <mark class="m-2" style="background:${hsl2hex(b[4][0], b[4][1], b[4][2])}">
	      Mark!
	    </mark>
	  </div>
	  `
	)
      })
    const text = `
      <span class="m-2 text-xl font-semibold px-2">
	    Text 
	</span>
	<div class="px-4 p-2 flex flex-col space-y-3 justify-start">
		${text_child.join("")}
	</div>
    `
    const border_child =[]
    color_palette.forEach((b) => {
      border_child.push(
	`<button style="border:2px solid ${hsl2hex(b[4][0], b[4][1], b[4][2])}"
	class="px-4 p-2 rounded-md m-2">
	  Button
	</button>`
      )
    })
    const border = `
      <span class="m-2 text-xl font-semibold px-2">
	    Border
	</span>
	<div class="px-4 p-2 flex flex-wrap justify-start">
		${border_child.join("")}
	</div>
    `
    const shadow_child =[]
    color_palette.forEach((b) => {
      shadow_child.push(
	`<span style="
	box-shadow:${hsl2hex(b[4][0], b[4][1], b[4][2])} 0px 5px 15px;
	width:60px;height:60px
	" 
	class="px-4 p-2 rounded-md m-5"></span>`
      )
    })
    const shadow = `
      <span class="m-2 text-xl font-semibold px-2">
	    Shadow
	</span>
	<div class="px-4 p-2 flex flex-wrap justify-start mb-5">
		${shadow_child.join("")}
	</div>
    `
    const svg = `
      <span class="m-2 text-xl font-semibold px-2">
	  SVG
	</span>
	<div class="px-4 p-2 flex flex-wrap items-center">
	<svg width="100" height="100" class="m-4"
	viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
   	<g clip-path="url(#clip0_105_323)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M106.973 87.6003C103.915 93.0385 96.0852 93.0385 93.027 87.6003L50.4686 11.9213C47.4696 6.58851 51.3234 7.97602e-06 57.4416 5.67316e-06L142.558 0C148.677 -5.34872e-07 152.53 6.58849 149.531 11.9213L106.973 87.6003ZM87.6003 106.973C93.0385 103.915 93.0385 96.0851 87.6003 93.0269L11.9213 50.4685C6.58848 47.4696 -1.12708e-05 51.3233 -1.15382e-05 57.4415L-1.52588e-05 142.558C-1.55262e-05 148.677 6.58849 152.53 11.9213 149.531L87.6003 106.973ZM106.973 112.4C103.915 106.961 96.0852 106.962 93.027 112.4L50.4686 188.079C47.4697 193.412 51.3234 200 57.4416 200H142.558C148.677 200 152.53 193.411 149.531 188.079L106.973 112.4ZM112.4 93.027C106.961 96.0853 106.961 103.915 112.4 106.973L188.079 149.531C193.412 152.53 200 148.677 200 142.558V57.4417C200 51.3235 193.411 47.4697 188.079 50.4687L112.4 93.027Z" fill="url(#paint0_linear_105_323)"/>
   	</g>
   	<defs>
      	<linearGradient id="paint0_linear_105_323" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
         <stop stop-color="${hsl2hex(...rand_col())}"/>
         <stop offset="1" stop-color="${hsl2hex(...rand_col())}"/>
      	</linearGradient>
      	<clipPath id="clip0_105_323">
         <rect width="200" height="200" fill="white"/>
      	</clipPath>
   	</defs>
	</svg>
	<svg width="100" height="100"
	viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
	class="m-2">
    	<g clip-path="url(#clip0_105_351)">
        <path d="M156.064 143.936L112.127 100L156.064 56.0636L200 100L156.064 143.936ZM43.9364 143.936L0 100L43.9364 56.0636L87.8728 100L43.9364 143.936ZM100 200L56.0636 156.064L100 112.127L143.936 156.064L100 200ZM100 87.8728L56.0636 43.9364L100 0L143.936 43.9364L100 87.8728Z" fill="url(#paint0_linear_105_351)"/>
    </g>
    	<defs>
        <linearGradient 
	id="paint0_linear_105_351" x1="20.5" y1="16" x2="100" y2="200" gradientUnits="userSpaceOnUse">
         <stop stop-color="${hsl2hex(...rand_col())}"/>
         <stop offset="1" stop-color="${hsl2hex(...rand_col())}"/>
        </linearGradient>
        <clipPath id="clip0_105_351">
            <rect width="200" height="200" fill="white"/>
        </clipPath>
    	</defs>
	</svg>
	</div>
    `
    const parent_layout = `
	<div class="color-mode w-full  h-auto 
	overflow-auto
	${localStorage.getItem('preview_theme') == 'dark' ? 'bg-slate-900' : 'bg-white'}
	${localStorage.getItem('preview_theme') == 'dark' ? 'text-slate-300' : 'text-slate-900'}
	flex flex-col pb-8">
		${nav}
		${buttons}
		${svg}
		${text}
		${border}
		${shadow}
	</div>
    `
    document.querySelector("#preview-tab-body").insertAdjacentHTML("beforeend",`
	  ${control_buttons}
	  ${parent_layout}
      `)
  }
}


function read_file_(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function open_image_file() {
    const input = document.createElement('input');
    input.style.display = "none"
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function() {
        const file = this.files[0];
        if (file) {
            try {
                const imageDataURL = await read_file_(file);
	        document.querySelector("#span-image-picker > span:last-child").textContent = file.name.slice(
		  0 , 20
		)
	        colorjs.prominent(imageDataURL, { amount: 12, format: "hex" }).then(color => {
		  document.querySelector("#image-generated-color").innerHTML = ""
		  color.forEach((e,i) => {
		    document.querySelector("#image-generated-color").classList.remove("hidden")
		    document.querySelector("#image-generated-color").insertAdjacentHTML("beforeend",`
			<button 
			style="
				background:${e};
				width:20px;
				height:20px;
				border-radius:5px;
				margin:0.5rem;
				"
				onclick="selected_image_color('${e}',${i})"
				>
			</button>
		      `)
		  })
		  document.querySelector("#span-image-picker").parentElement.insertAdjacentHTML("beforeend", `
		      <button 
		        id="clear-image-color"
			class="absolute rounded-s-md top-0 right-0 cursor-pointer hover:brightness-125
			p-2 font-semibold
			rounded-e-md text-lg z-20 "
			onclick="
	        	document.querySelector('#clear-image-color').remove()
			document.querySelector('#image-generated-color').classList.add('hidden');
	        	document.querySelector('#span-image-picker > span:last-child').textContent = 'Read Image'
			">
			  <i class="fa-solid fa-trash"></i>
		      </button>
		    `)
		  document.querySelector("#span-color-picker").style.background = color[0]
		  document.querySelector("#input-color-picker").value = color[0]
		  document.querySelector("#input-color-text").value = color[0]
		  document.querySelector("#image-generated-color > button").classList.add("border-4")
		  document.querySelector("#image-generated-color > button").classList.add("border-blue-500")
	      })
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };
    input.click();
}

function selected_image_color(color,num){
    document.querySelectorAll("#image-generated-color > button").forEach((e,i) => {
		if(i == num){
		  e.classList.add("border-4")
		  e.classList.add("border-blue-500")
		} else {
		  e.classList.remove("border-4")
		  e.classList.remove("border-blue-500")
		}
    })
		  document.querySelector("#span-color-picker").style.background = color
		  document.querySelector("#input-color-picker").value = color
		  document.querySelector("#input-color-text").value = color
}

document.addEventListener("DOMContentLoaded", function(e){
    show_tab("generate")
    change_random_color()
    if (navigator.serviceWorker) {
      window.addEventListener('load', () => {
	  navigator.serviceWorker
	      .register('/service_worker.js')
	      .then(reg => console.log('Service Worker Registered'))
	      .catch(swErr => console.log(
		    `Service Worker Installation Error: ${swErr}}`));
	});
    }
})
