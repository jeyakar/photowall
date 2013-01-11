$(function(){
	var empJSON;
	var empRoles =  ["All Roles"];
	var empProjects =  ["All Projects"];
	var allRoles, allProjects;

	$.getJSON('scripts/emp.json', function(data) {	
		empJSON = data;
		generateDropdowns();
		generateData();
	});
	
	generateDropdowns = function(){
		
		$.each(empJSON, function(index, val){
			empRoles.push(empJSON[index]['role']);
			empProjects.push(empJSON[index]['currentproject']); 	
		});
		
		allRoles = $.unique(empRoles).reverse();
		allProjects = $.unique(empProjects).reverse();
			
		$.each(allRoles, function(index, val){
			$("#dropdown_role").append("<li><a href='javascript:void(0)'>" + allRoles[index] + "</a></li>");	
		});
		
		$.each(allProjects, function(index, val){
			$("#dropdown_project").append("<li><a href='javascript:void(0)'>" + allProjects[index] + "</a></li>");	
		});
		
		$("#dropdown_role li a").bind("click",function(){
			filterRole.apply(this);	
		});
		
		$("#dropdown_project li a").bind("click",function(){
			filterProject.apply(this);	
		});
			
	}
	
	generateData = function(){
		
		var valRole, valProject;
		var filterRole = $("#filter_role a.sel").text().split("Showing ")[1];
		var filterPrj = $("#filter_project a.sel").text().split("Showing ")[1];
		var sortby = $(".sort_panel a.sel").text().split("Sorted by ")[1];
		sortby = sortby.toLowerCase();
		
		if (filterRole != "All Roles")
		{
			valRole = [filterRole];	
		}
		else
		{
			valRole = allRoles;
		}
		
		if (filterPrj != "All Projects")
		{
			valProject = [filterPrj];
		}
		else
		{
			valProject = allProjects;	
		}
		
		if (sortby == "date joined")
		{
			var sortbyfield = Object.keys(empJSON).sort(function(a, b){
				console.log(a);
				return a > b;	
			});	
		}
		else
		{
			var sortbyfield = Object.keys(empJSON).sort(function(a, b){
				return empJSON[a][sortby] > empJSON[b][sortby];	
			});	
		}
		
		$("#employeeDetails").html("");
		
		$.each(sortbyfield, function(index, val){
			
			if (($.inArray(empJSON[val]['role'], valRole) > -1) && ($.inArray(empJSON[val]['currentproject'], valProject) > -1))
			{
				var obj = empJSON[val];
				var empData = "<div class='empData' id='" + val + "'>";
				var empPhoto = empData + "<div class='empPhoto'><img src='photos/" + val + ".jpg' /></div>"			
				var empSlideData = empPhoto + "<div class='empSlideData'>";
				empSlideData += "<span class='name'>" + obj.name + "</span>";
				empSlideData += "<span>" + obj.role + "</span>";		
				empSlideData += "</div></div>";
				$("#employeeDetails").hide().append(empSlideData).fadeIn("fast");
				
				$(".empData").unbind('click').bind("mouseenter", function(){
					showSlideData.apply(this);
				});
				
				$(".empData").bind("mouseleave", function(){
					hideSlideData.apply(this);
				});
				
				$(".empData").bind("click", function(event){
					showPopup(event);	
				});
				
				window.ej = empJSON;
			}
		});
		
	}
	
	$(".sort_panel ul a").click(function(){
		
		$(".sort_panel ul").toggleClass("hide");
		var sortOption = $(this).text();		
		$(".sort_panel a.sel").html("Sorted by " + sortOption);
		
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
		empPopupData += "<label class='role'>" + empJSON[curEmpIndex].role + "</label><div class='contact'>";
		empPopupData += "<label class='mobile'>" + empJSON[curEmpIndex].mobile + "</label>";
		empPopupData += "<label class='email'>" + empJSON[curEmpIndex].email + "</label>";
		empPopupData += "<label class='email'>" + empJSON[curEmpIndex].personalemail + "</label>";
		empPopupData += "<label class='skype'>" + empJSON[curEmpIndex].skype + "</label></div>";
		empPopupData += "</div></div>";
		
		$("#employeePopup .content").append(empPopupData);
		$("#employeePopup").fadeIn("fast");	
	}
	
	$(".content_panel .close").click(function(){
		$("#employeePopup").fadeOut("fast");
		$("#employeePopup .content").html("");		
	});
	
	$(".sort_panel a.sel").click(function(){
		$(".sort_panel ul").toggleClass("hide");	
	});
	
	$("#filter_role a.sel").click(function(){
		$("#filter_role ul").toggleClass("hide");	
	});
	
	$("#filter_project a.sel").click(function(){
		$("#filter_project ul").toggleClass("hide");	
	});
	
	filterRole = function(){
		$("#filter_role a.sel").html("Showing " + this.text);
		$("#filter_role ul").addClass("hide");
		generateData();	
	}
	
	filterProject = function(){
		$("#filter_project a.sel").html("Showing " + this.text);
		$("#filter_project ul").addClass("hide");
		generateData();	
	}
	
	
});