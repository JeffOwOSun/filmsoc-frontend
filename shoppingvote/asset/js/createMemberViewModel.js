cr.define('cr.view.createMember',function(){
    var inputTemplate = $.templates("#inputTmpl");

    //Define several parameters for the jsRender templating engine.
    //Actual webpage is generated based on this array.

    var inputs = [
        {
            label:"ITSC:",
            id:"itsc",
            name:"itsc",
            type:"text",
            placeholder:"e.g. ysunai",
        },
        {
            label:"Student ID:",
            id:"student_id",
            name:"student_id",
            type:"text",
            placeholder:"8-digit number",
            maxlength:"8",
        },
        {
            label:"Mobile Number:",
            id:"mobile",
            name:"mobile",
            type:"text",
            placeholder:"8-digit HK phone number",
            maxlength:"8",
        },
        {
            label:"Member Type:",
            id:"member_type",
            name:"member_type",
            isSelect: true,
            options:[
                {
                    value:"Full",
                    text:"Full Member",
                },
                {
                    value:"OneSem",
                    text:"One Semester",
                },
                {
                    value:"OneYear",
                    text:"One Year",
                },
                {
                    value:"TwoYear",
                    text:"Two Year",
                },
                {
                    value:"ThreeYear",
                    text:"Three Year",
                },
            ],
        },
        {
            label:"Expire At:",
            id:"expire_at",
            name:"expire_at",
            type:"text",
        },
    ]
    
    //used to reset the Input values
    function resetInputs(){
        $('form').find("#itsc, #student_id, #mobile").val("");
        $("#member_type").val("Full");
        $("#member_type").change();
    }

    //Should be called upon load of the view.
    //Change to other names later.
    function initialize(){
        //render the inputs and replace the placeholder innerHTML with the rendered data
        $("#inputs").html(inputTemplate.render(inputs));
        //Initialize the datepicker
        $('#expire_at').datepicker({
            format: 'yyyy-mm-dd',
        });
        $("#member_type").change(function(){
            var offset={
                year:0,
                month:0,
            }
            switch ($(this).val()){
                case "Full":
                    offset.year=4;
                    break;
                case "OneSem":
                    offset.month=6;
                    break;
                case "OneYear":
                    offset.year=1;
                    break;
                case "TwoYear":
                    offset.year=2;
                    break;
                case "ThreeYear":
                    offset.year=3;
                    break;
            }
            var dateObj = new Date();
            dateObj.setYear(dateObj.getFullYear()+offset.year);
            dateObj.setMonth(dateObj.getMonth()+offset.month);
            $('#expire_at').datepicker('setValue',dateObj);
        });
        
        //triggers once to fill the date text box
        $("#member_type").change()
        
        //Reset button click handler
        $("#buttonReset").click(function(){
            resetInputs();
            return false;
        });

        $("form").submit(function(){
            //formArray is for rendering modalTemplate.
            var formArray = $(this).serializeArray();
            var content = $.templates("#userConfirmTmpl").render({
                formData: formArray,
            })
            //Show Confirmation dialog.
            var confirmDialog = new BootstrapDialog({
                title: "Please Confirm the Info Below",
                buttons:[{
                    label: "Cancel",
                    cssClass: 'btn-default',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                },{
                    label: "Submit",
                    cssClass: 'btn-primary',
                    action: function(dialogRef){
                        //formObj is for sending.
                        var formObj = $("form").serializeObject();
                        cr.model.User.post(formObj);
                        dialogRef.close();
                    },

                }],
            })
            confirmDialog.realize();
            confirmDialog.getModalBody().html(content);
            confirmDialog.open();
            
            
            //prevent default GET style request.
            return false;
        });
    }
    
    return{
        initialize: initialize,
    }
})

$(document).ready(cr.view.createMember.initialize);


