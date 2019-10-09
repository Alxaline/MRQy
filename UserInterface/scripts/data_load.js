/* Initiation model.
 * read in dataset, initialize data dict, initialize selectors, initialize each views.
 * last modified: 03/11/2018 23:22:00
 * update log: init header and comments.
 */ 


function data_loading () {

	var $this = $(this);
	var cur_file = null;

	// escape the cancelation case
	if ($this.val() == "") {
		return;
	} else {
		cur_file = $this.get(0).files[0];
	}

	// hide the "Upload Dataset" button
	$("#upload-button").css("display", "none");

	// read dataset from the file
	FILE_NAME = cur_file.name.split(".")[0];
	console.log("[LOG] Read in file: " + FILE_NAME);
	var fileReader = new FileReader();
	fileReader.readAsText(cur_file);
	fileReader.onload = function () {

		console.log("[LOG] App initializing...");
		var file_text = fileReader.result;


		var absdirRe = /#outdir:?\s*([^\s]*)\s*\n/;
		var abs_outdir = absdirRe.exec(file_text)[1];
		var reldirRe = /([^\\\/]*)$/;
		var rel_outdir = reldirRe.exec(abs_outdir)[1];
		DATA_PATH = DATA_PATH + rel_outdir + "/" ;
		FILE_HEADER = file_text.split(/#dataset:\s?/)[0] + "#dataset: ";
		dataset_text = file_text.split(/#dataset:\s?/)[1];
		

		// load dataset as list.
		ORIGINAL_DATASET = d3.tsv.parse(dataset_text, function (d) {
			if (d.hasOwnProperty("")) delete d[""];
			for (var key in d) {
				if ($.isNumeric(d[key])) {
					d[key] = +d[key];
				}
			}
			return d;
		});

		// console.log(ORIGINAL_DATASET);

		// ORIGINAL_DATASET2 = ORIGINAL_DATASET;


		ORIGINAL_DATASET2 = d3.tsv.parse(dataset_text, function (d) {
			if (d.hasOwnProperty("")) delete d[""];
			for (var key in d) {
				if ($.isNumeric(d[key])) {
					d[key] = +d[key];
				}
			}
			return d;
		});


		ORIGINAL_DATASET1 = d3.tsv.parse(dataset_text, function (d) {
			if (d.hasOwnProperty("")) delete d[""];
			for (var key in d) {
				if ($.isNumeric(d[key])) {
					d[key] = +d[key];
				}
			}
			return d;
		});






		



		for (var j = 0; j < ORIGINAL_DATASET.length; j ++) {
			image_names[j] = ORIGINAL_DATASET[j]["Name of Images"];
			patient_names[j] = ORIGINAL_DATASET[j]["Patient"];
			delete ORIGINAL_DATASET[j]["Name of Images"];
		};





		for (var j = 0; j < ORIGINAL_DATASET2.length; j ++) {
			image_names[j] = ORIGINAL_DATASET2[j]["Name of Images"];
			patient_names[j] = ORIGINAL_DATASET2[j]["Patient"];
			delete ORIGINAL_DATASET2[j]["Name of Images"];
			delete ORIGINAL_DATASET2[j]["Manufacturer"];
			delete ORIGINAL_DATASET2[j]["VR_x"]
			delete ORIGINAL_DATASET2[j]["VR_y"]
			delete ORIGINAL_DATASET2[j]["VR_z"]
			delete ORIGINAL_DATASET2[j]["MFS"]
			delete ORIGINAL_DATASET2[j]["Rows"]
			delete ORIGINAL_DATASET2[j]["Columns"]
			delete ORIGINAL_DATASET2[j]["TR"]
			delete ORIGINAL_DATASET2[j]["TE"]
			delete ORIGINAL_DATASET2[j]["Number"]
		};



		// console.log(ORIGINAL_DATASET2[1]["Patient"]);

		for (var j = 0; j < ORIGINAL_DATASET1.length; j ++) {
			image_names[j] = ORIGINAL_DATASET1[j]["Name of Images"];
			patient_names[j] = ORIGINAL_DATASET1[j]["Patient"];
			delete ORIGINAL_DATASET1[j]["Name of Images"];
			// delete ORIGINAL_DATASET1[j]["Number"]
			delete ORIGINAL_DATASET1[j]["Mean"]
			delete ORIGINAL_DATASET1[j]["Range"];
			delete ORIGINAL_DATASET1[j]["%CV"]
			delete ORIGINAL_DATASET1[j]["CPP"]
			delete ORIGINAL_DATASET1[j]["SNR1"]
			delete ORIGINAL_DATASET1[j]["SNR2"]
			delete ORIGINAL_DATASET1[j]["SNR3"]
			delete ORIGINAL_DATASET1[j]["SNR4"]
			delete ORIGINAL_DATASET1[j]["SNR5"]
			delete ORIGINAL_DATASET1[j]["CNR"]
			delete ORIGINAL_DATASET1[j]["CVP"]
			delete ORIGINAL_DATASET1[j]["EFC"]
			delete ORIGINAL_DATASET1[j]["FBER"]
			delete ORIGINAL_DATASET1[j]["PSNR"]
		};


		




		// show the current loaded dataset name
		$("#dataset-tag").css("display", "inline")
						 .text("Current dataset: " + cur_file.name + " | Number of Patients: " + ORIGINAL_DATASET.length /4 + ", CCF_Crohns_CTEs");
						 // .text("Current dataset: " + cur_file.name + " | Number of Patients: " + (ORIGINAL_DATASET.length - 8)/4  + ", CCF_Crohns_CTEs");



		// build case list.		
		ORIGINAL_CASE_LIST = ORIGINAL_DATASET.map(function(d){return d["Patient"];});
		// ORIGINAL_CASE_LIST2 = ORIGINAL_DATASET2.map(function(d){return d["Patient"];});
		// console.log(ORIGINAL_CASE_LIST)

		// ORIGINAL_CASE_LIST2 = ORIGINAL_DATASET.map(function(d){return d["Name of Images"];});
		// console.log(ORIGINAL_CASE_LIST2)

		// build case dict with casename as key. 
		for (var i = 0; i < ORIGINAL_DATASET.length; i ++) {
			var cur_file_name = ORIGINAL_DATASET[i]["Patient"];
			ORIGINAL_CASE_DICT[cur_file_name] = {};
			for (var index in FEATURES_TO_MAP) {
				ORIGINAL_CASE_DICT[cur_file_name][FEATURES_TO_MAP[index]] = ORIGINAL_DATASET[i][FEATURES_TO_MAP[index]];
			}
			ORIGINAL_CASE_DICT[cur_file_name]["dom_id"] = cur_file_name.replace(/\.|\#/g, "-");
		}
		


		// for (var i = 0; i < ORIGINAL_DATASET2.length; i ++) {
		// 	var cur_file_name = ORIGINAL_DATASET2[i]["Patient"];
		// 	ORIGINAL_CASE_DICT2[cur_file_name] = {};
		// 	for (var index in FEATURES_TO_MAP) {
		// 		ORIGINAL_CASE_DICT2[cur_file_name][FEATURES_TO_MAP[index]] = ORIGINAL_DATASET2[i][FEATURES_TO_MAP[index]];
		// 	}
		// 	ORIGINAL_CASE_DICT2[cur_file_name]["dom_id"] = cur_file_name.replace(/\.|\#/g, "-");
		// }
	

		// for (var img_type_index = 0; img_type_index < DEFAULT_IMAGE_EXTENSIONS.length; img_type_index ++) {
		// var src ="";
		var img = new Image();
		img.typeidx = 0;
		// img.onload = (function () {
		// 	// CHECK_IMAGE_EXTENSIONS[this.typeidx] = true;
		// });
		img.onerror = (function () {
			// SKIP_IMAGE_EXTENSIONS.push(this.typeidx);
			CHECK_IMAGE_EXTENSIONS[this.typeidx] = true;
		});
		img.src = "";
	// }





		// build feature list
		ORIGINAL_FEATURE_LIST = Object.keys(ORIGINAL_DATASET[0]);
		ORIGINAL_FEATURE_LIST2 = Object.keys(ORIGINAL_DATASET2[0]);
		ORIGINAL_FEATURE_LIST1 = Object.keys(ORIGINAL_DATASET1[0]);



		// delete ORIGINAL_FEATURE_LIST2[1];

		// console.log(ORIGINAL_FEATURE_LIST2);

		// for (var j = 0; j < ORIGINAL_FEATURE_LIST.length; j ++) {
		// 	if (ORIGINAL_FEATURE_LIST[j] == "Name of Images") {
		// 	delete ORIGINAL_FEATURE_LIST[j]["Name of Images"]
		// };


		// delete ORIGINAL_FEATURE_LIST[0] = [];
	

		// ORIGINAL_FEATURE_LIST.forEach(function(v){ delete v.MFS });
		// ORIGINAL_FEATURE_LIST.length = 3;

		// console.log(ORIGINAL_FEATURE_LIST);


		// ORIGINAL_FEATURE_LIST.length = 10;


		// ORIGINAL_FEATURE_LIST2.length = 3;
		// console.log(ORIGINAL_DATASET.length)


		CURRENT_MULTI_SELECTED = ORIGINAL_DATASET;
		// CURRENT_MULTI_SELECTED2 = ORIGINAL_DATASET2;

		


		// init_image_format_list();






		var image_check_interval = setInterval (function () {
			var check_sum = 0;
			for (var ck_index = 0; ck_index < CHECK_IMAGE_EXTENSIONS.length; ck_index ++) {
				check_sum += CHECK_IMAGE_EXTENSIONS[ck_index];
			}
			if (check_sum == CHECK_IMAGE_EXTENSIONS.length) {
				clearInterval (image_check_interval);

				// initialize table view
				initialize_data_table(ORIGINAL_DATASET1);
				if (!OPEN_WITH_TABLE) {
					hide_view("table");
				}
				d3.select("#table-btn")
					.classed("view-mngmt-btn-hidden", false)
					.classed("view-enabled", OPEN_WITH_TABLE)
					.classed("view-disabled", !OPEN_WITH_TABLE);



				// initialize table_meas view
				initialize_data_table_meas(ORIGINAL_DATASET2);
				if (!OPEN_WITH_TABLE_meas) {
					hide_view("table_meas");
				}
				d3.select("#table-btn_meas")
					.classed("view-mngmt-btn-hidden", false)
					.classed("view-enabled", OPEN_WITH_TABLE_meas)
					.classed("view-disabled", !OPEN_WITH_TABLE_meas);






				// initialize chart view
				initialize_chart_view(ORIGINAL_DATASET, CURRENT_VIS_TYPE);
				if (!OPEN_WITH_CHART) {
					hide_view("chart");
				}
				d3.select("#chart-btn")
					.classed("view-mngmt-btn-hidden", false)
					.classed("view-enabled", OPEN_WITH_CHART)
					.classed("view-disabled", !OPEN_WITH_CHART);

				// initialize image view
				initialize_image_view(ORIGINAL_CASE_LIST);
				if (!OPEN_WITH_IMAGE) {
					hide_view("image");
				}
				d3.select("#image-btn")
					.classed("view-mngmt-btn-hidden", false)
					.classed("view-enabled", OPEN_WITH_IMAGE)
					.classed("view-disabled", !OPEN_WITH_IMAGE);

				$("#view-mngmt-btn-group").css("display", "block");
				d3.select("#page-title")
					.classed("mr-md-auto", false)
					.classed("mr-md-3", true);

				console.log("[LOG] App initialized.");
				APP_INITIALIZED = true;
			} else {
				console.log("waiting for image type checking ...");
			}
		}, 500);
	}
}

function data_sorting (keyword, desc=false) {
	var compare = function (a, b) {
		if (a[keyword] < b[keyword]) {
			if (desc) {
				return 1;
			} else {
				return -1;
			}
		} else if (a[keyword] > b[keyword]) {
			if (desc) {
				return -1;
			} else {
				return 1;
			}
		} else {
			return 0;
		}
	}

	CURRENT_SORT_ATTRIBUTE = keyword;
	ORIGINAL_DATASET.sort(compare);
	ORIGINAL_CASE_LIST = ORIGINAL_DATASET.map(function (d) {return d["Patient"];});
	// ORIGINAL_CASE_LIST2 = ORIGINAL_DATASET.map(function (d) {return d["Patient"];});
	CURRENT_MULTI_SELECTED.sort(compare);
	CURRENT_CASE_LIST = CURRENT_MULTI_SELECTED.map(function (d) {return d["Patient"];});
}


// function init_image_format_list () {

// 	var test_file = ORIGINAL_DATASET[0]["Patient"];
// 	var test_out_dir = ORIGINAL_DATASET[0]["outdir"];

// 	for (var img_type_index = 0; img_type_index < DEFAULT_IMAGE_EXTENSIONS.length; img_type_index ++) {
// 		// var src = DATA_PATH + test_file + "/" + "000000" + DEFAULT_IMAGE_EXTENSIONS[img_type_index];
// 		// var src = DATA_PATH + test_file  + DEFAULT_IMAGE_EXTENSIONS[img_type_index];
// 		var src ="";
// 		var img = new Image();
// 		img.typeidx = img_type_index;
// 		img.onload = (function () {
// 			CHECK_IMAGE_EXTENSIONS[this.typeidx] = true;
// 		});
// 		img.onerror = (function () {
// 			SKIP_IMAGE_EXTENSIONS.push(this.typeidx);
// 			CHECK_IMAGE_EXTENSIONS[this.typeidx] = true;
// 		});
// 		img.src = src;
// 	}
// }

