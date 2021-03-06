cr.define('cr.view.createMember',function(){
    var inputTemplate;

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
        inputTemplate = $.templates("#inputTmpl");
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

            var springMonth=1,
                fallMonth=8;

            var dateObj = new Date();

            switch ($(this).val()){
                case "Full":
                    offset.year=4;
                    //memebers joining before June will end after *effectively* 3.5 years
                    //e.g. member at 2014-5-20 will end at 2017-9-1 
                    if (dateObj.getMonth()<5 && offset.year!=0){
                        offset.year-=1;
                    }
                    dateObj.setYear(dateObj.getFullYear()+offset.year);
                    dateObj.setMonth(8);
                    dateObj.setDate(1);
                    break;
                case "OneSem":
                    dateObj.setYear((dateObj.getMonth()<fallMonth && dateObj.getMonth()>= springMonth) ? dateObj.getFullYear() : dateObj.getFullYear()+1);
                    dateObj.setMonth((dateObj.getMonth()<fallMonth && dateObj.getMonth()>= springMonth) ? fallMonth : springMonth);
                    dateObj.setDate(1);
                    break;
                case "OneYear":
                    offset.year=1;
                    //memebers joining before June will end after *effectively* 3.5 years
                    //e.g. member at 2014-5-20 will end at 2017-9-1 
                    if (dateObj.getMonth()<5 && offset.year!=0){
                        offset.year-=1;
                    }
                    dateObj.setYear(dateObj.getFullYear()+offset.year);
                    dateObj.setMonth(8);
                    dateObj.setDate(1);
                    break;
                case "TwoYear":
                    offset.year=2;
                    //memebers joining before June will end after *effectively* 3.5 years
                    //e.g. member at 2014-5-20 will end at 2017-9-1 
                    if (dateObj.getMonth()<5 && offset.year!=0){
                        offset.year-=1;
                    }
                    dateObj.setYear(dateObj.getFullYear()+offset.year);
                    dateObj.setMonth(8);
                    dateObj.setDate(1);
                    break;
                case "ThreeYear":
                    offset.year=3;
                    //memebers joining before June will end after *effectively* 3.5 years
                    //e.g. member at 2014-5-20 will end at 2017-9-1 
                    if (dateObj.getMonth()<5 && offset.year!=0){
                        offset.year-=1;
                    }
                    dateObj.setYear(dateObj.getFullYear()+offset.year);
                    dateObj.setMonth(8);
                    dateObj.setDate(1);
                    break;
            }
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
                        dialogRef.close();
                        var sendingDialog = new BootstrapDialog({closable:true});
                        sendingDialog.realize();
                        sendingDialog.getModalContent().html('<div class="alert alert-info role="alert" style="margin-bottom: 0">Sending...</div>');
                        sendingDialog.open();
                        var formObj = $("form").serializeObject();
                        cr.model.User.post(formObj,function(obj){
                        	sendingDialog.close();
                            cr.ui.showAlert("Welcome, "+obj.full_name+"!","success");
                        });
                        
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

$(document).on('authload',cr.view.createMember.initialize);


