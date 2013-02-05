$(function(){
	//var empJSON;
	var allroles = [];
	var uniqueroles = [];
	var role_selected = [];
	
	var allprojects = [];
	var uniqueprojects = [];
	
	$.getJSON('scripts/emp2.json', function(data) {	
		empJSON = data;
		generateDropdowns();
		generateData();
	});
	
	generateDropdowns = function(){
		$.each(empJSON, function(index){
			allroles.push(empJSON[index]['role']);
			allprojects.push(empJSON[index]['currentproject']);	
		});
		
		$.each(allroles, function(index, element){
			if ($.inArray(element, uniqueroles) === -1)
			{
				 uniqueroles.push(element);
				 $("#dropdown_role").append("<li><a href='javascript:void(0)'>" + element + "</a></li>");		
			}
		});
		
		$("#dropdown_role").prepend("<li><a href='javascript:void(0)'>All Roles</a></li>");		
		
		$("#dropdown_role li a").bind("click", function(){
			filterRole.apply(this);	
		});
		
		$.each(allprojects, function(index, element){
			if ($.inArray(element, uniqueprojects) === -1)
			{
				 uniqueprojects.push(element);
				 $("#dropdown_project").append("<li><a href='javascript:void(0)'>" + element + "</a></li>");		
			}
		});	
		
		$("#dropdown_project").prepend("<li><a href='javascript:void(0)'>All Projects</a></li>");		
		
		$("#dropdown_project li a").bind("click", function(){
			filterProject.apply(this);	
		});
			
	}
	
	generateData = function(){
		var filterRole = $("#filter_role a.sel").text().split("Showing ")[1];
		var filterProject = $("#filter_project a.sel").text().split("Showing ")[1];
		var sortby = $(".sort_panel a.sel").text().split("Sorted by ")[1];
		sortby = sortby.toLowerCase();
		console.log(filterRole +  " --- " + sortby);
		
		if (filterRole != "All Roles")
		{ 
			role_selected = [];
			role_selected.push(filterRole);
		}
		else
		{
			role_selected = uniqueroles;	
		}
		
		if (filterProject != "All Projects")
		{ 
			project_selected = [];
			project_selected.push(filterProject);
		}
		else
		{
			project_selected = uniqueprojects;	
		}
		
		var sorted_empJSON = [];
		
		$.each(empJSON, function(index){
			sorted_empJSON.push(index);	
		});
			
		if (sortby != "date joined")
		{
			var temp, t;
			for (i = 0; i < sorted_empJSON.length - 1; i++)
			{
				for(j=i+1; j < sorted_empJSON.length; j++)
				{
					temp=sorted_empJSON[i];
					if (empJSON[sorted_empJSON[i]][sortby] > empJSON[sorted_empJSON[j]][sortby])
					{
						sorted_empJSON[i] = sorted_empJSON[j];
						sorted_empJSON[j] = temp;	
					}
				}
			}
		}
		
		$("#employeeDetails").html("");
		
		$.each(sorted_empJSON, function(index, val){
			if (($.inArray(empJSON[val]['role'], role_selected) > -1) && ($.inArray(empJSON[val]['currentproject'], project_selected) > -1))
			{
				console.log("yes");
				var obj = empJSON[val];
				var empData = "<div class='empData' id='" + val + "'>";
				var empPhoto = empData + "<div class='empPhoto'><img src='photos/" + val + ".jpg' /></div>"			
				var empSlideData = empPhoto + "<div class='empSlideData'>";
				empSlideData += "<span class='name'>" + obj.name + "</span>";
				empSlideData += "<span>" + obj.role + "</span>";		
				empSlideData += "</div></div>";
				$("#employeeDetails").append(empSlideData).show("fast");
				
				$(".empData").unbind('click').bind("mouseenter", function(){
					showSlideData.apply(this);
				});
				
				$(".empData").bind("mouseleave", function(){
					hideSlideData.apply(this);
				});
				
				$(".empData").bind("click", function(event){
					showPopup(event);	
				});		
			}
		});
		
		
	}
	
	$("#filter_role a.sel").click(function(){
		$("#filter_role ul").toggleClass("hide");	
	});
	
	
	filterRole = function(){
		$("#filter_role a.sel").html("Showing " + this.text);
		$("#filter_role ul").addClass("hide");
		generateData();	
	}
	
	$(".sort_panel a.sel").click(function(){
		$(".sort_panel ul").toggleClass("hide");	
	});
	
	$(".sort_panel ul a").click(function(){	
		$(".sort_panel ul").toggleClass("hide");
		var sortOption = $(this).text();		
		$(".sort_panel a.sel").html("Sorted by " + sortOption);
		generateData();
	});
	
	$("#filter_project a.sel").click(function(){
		$("#filter_project ul").toggleClass("hide");	
	});
	
	
	filterProject = function(){
		$("#filter_project a.sel").html("Showing " + this.text);
		$("#filter_project ul").addClass("hide");
		generateData();	
	}
	
	$(".project_panel a.sel").click(function(){
		$(".project_panel ul").toggleClass("hide");	
	});
	
	$(".project_panel ul a").click(function(){	
		$(".project_panel ul").toggleClass("hide");
		var sortOption = $(this).text();		
		$(".project_panel a.sel").html("Sorted by " + sortOption);
		generateData();
	});
	
	
	
	showSlideData = function(){		
		$(".empSlideData", this).slideDown("fast");	
	}
	
	hideSlideData = function(){		
		$(".empSlideData", this).slideUp("fast");	
	}
	
	showPopup = function(event){
		var curEmpIndex = ($(event.target).closest(".empData").attr("id"));
		var empPopupData = "<div class='empPopupData'><div class='photo_panel'><img src='photos/" + curEmpIndex + ".jpg' alt='" + empJSON[curEmpIndex].Name + "' /></div><div class='data_panel'>";
		empPopupData += "<label class='name'>" + empJSON[curEmpIndex].name + "</label>";
		empPopupData += "<label class='role'>" + empJSON[curEmpIndex].role + ", </label><label class='grade'>" + empJSON[curEmpIndex].grade + "</label><div class='clear'></div><div class='contact'>";
		empPopupData += "<label class='mobile'>" + empJSON[curEmpIndex].mobile + "</label>";
		empPopupData += "<label class='email'>" + empJSON[curEmpIndex].email + "</label></div>";
		empPopupData += "<label class='exp'>TW / Total Experience : <span>" + empJSON[curEmpIndex].twexp + " / " + empJSON[curEmpIndex].exp + "</span></label>";
		
		empPopupData += "</div><div class='clear'></div>";
		empPopupData += "<label class='skills'>Skills</label><label class='skills_value'>" + empJSON[curEmpIndex].skills + "</label></div>";
		
		$("#employeePopup .content").append(empPopupData);
		$("#employeePopup").css("height",document.height);
		$("#employeePopup .content_panel").css("top",scrollY + 150);
		$("#employeePopup .content_panel").css("left",document.width/2 - 250);
		
		$("#employeePopup").fadeIn("fast");	
		
	}
	
	$(".content_panel .close").click(function(){
		$("#employeePopup").fadeOut("fast");
		$("#employeePopup .content").html("");		
	});
	
	
	
});