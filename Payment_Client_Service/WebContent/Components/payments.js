$(document).ready(function() 
{  
	if ($("#alertSuccess").text().trim() == "")  
	{   
		$("#alertSuccess").hide();  
	}  
	$("#alertError").hide(); }); 
 
// SAVE ============================================ 
$(document).on("click", "#btnSave", function(event) 
{  
	// Clear alerts---------------------  
	$("#alertSuccess").text("");  
	$("#alertSuccess").hide();  
	$("#alertError").text("");  
	$("#alertError").hide(); 
 
	// Form validation-------------------  
	var status = validatePaymentForm();  
	if (status != true)  
	{   
		$("#alertError").text(status);   
		$("#alertError").show();   
		return;  
	} 
 
	// If valid------------------------  
	var type = ($("#hidPayIDSave").val() == "") ? "POST" : "PUT"; 
	
	$.ajax( 
	{  
		url : "PaymentsAPI",  
		type : type,  
		data : $("#formPayment").serialize(),  
		dataType : "text",  
		complete : function(response, status)  
		{   
			onPaymentSaveComplete(response.responseText, status);  
		} 
	}); 
}); 

function onPaymentSaveComplete(response, status) 
{  
	if (status == "success")  
	{   
		var resultSet = JSON.parse(response); 

		if (resultSet.status.trim() == "success")   
		{    
			$("#alertSuccess").text("Successfully saved.");    
			$("#alertSuccess").show(); 

			$("#divPaymentsGrid").html(resultSet.data);   
		} else if (resultSet.status.trim() == "error")   
		{    
			$("#alertError").text(resultSet.data);    
			$("#alertError").show();   
		} 

	} else if (status == "error")  
	{   
		$("#alertError").text("Error while saving.");   
		$("#alertError").show();  
	} else  
	{   
		$("#alertError").text("Unknown error while saving..");   
		$("#alertError").show();  
	} 

	$("#hidPayIDSave").val("");  
	$("#formPayment")[0].reset(); 
} 
 
// UPDATE========================================== 
$(document).on("click", ".btnUpdate", function(event) 
{     
	$("#hidPayIDSave").val($(this).closest("tr").find('#hidPayIDUpdate').val());     
	$("#pType").val($(this).closest("tr").find('td:eq(0)').text());     
	$("#Nic").val($(this).closest("tr").find('td:eq(1)').text());     
	$("#PaymentPrice").val($(this).closest("tr").find('td:eq(2)').text());     
	$("#pDate").val($(this).closest("tr").find('td:eq(3)').text()); 
}); 

//REMOVE===========================================
$(document).on("click", ".btnRemove", function(event) 
{  
	$.ajax(  
	{   
		url : "PaymentsAPI",   
		type : "DELETE",   
		data : "PayID=" + $(this).data("paymentid"),   
		dataType : "text",   
		complete : function(response, status)   
		{    
			onPaymentDeleteComplete(response.responseText, status);   
		}  
	}); 
}); 

function onPaymentDeleteComplete(response, status) 
{  
	if (status == "success")  
	{   
		var resultSet = JSON.parse(response); 

		if (resultSet.status.trim() == "success")   
		{    
			$("#alertSuccess").text("Successfully deleted.");    
			$("#alertSuccess").show(); 
		
			$("#divPaymentsGrid").html(resultSet.data);   
		} else if (resultSet.status.trim() == "error")   
		{    
			$("#alertError").text(resultSet.data);    
			$("#alertError").show();   
		}

	} else if (status == "error")  
	{   
		$("#alertError").text("Error while deleting.");   
		$("#alertError").show();  
	} else  
	{   
		$("#alertError").text("Unknown error while deleting..");   
		$("#alertError").show();  
	}
}
 
// CLIENT-MODEL========================================================================= 
function validatePaymentForm() 
{  
	// CODE  
	if ($("#pType").val().trim() == "")  
	{   
		return "Insert Payment Type.";  
	} 
 
	// NAME  
	if ($("#Nic").val().trim() == "")  
	{   
		return "Insert NIC.";  
	} 
	//PRICE-------------------------------  
	if ($("#PaymentPrice").val().trim() == "")  
	{   
		return "Insert Payment Price.";  
	} 

	// is numerical value  
	var tmpPrice = $("#PaymentPrice").val().trim();  
	if (!$.isNumeric(tmpPrice))  
	{   
		return "Insert a numerical value for Payment Price.";  
	} 

	// convert to decimal price  
	$("#PaymentPrice").val(parseFloat(tmpPrice).toFixed(2)); 

	// DESCRIPTION------------------------  
	if ($("#pDate").val().trim() == "")  
	{   
		return "Insert Date.";  
	} 

	return true; 
}