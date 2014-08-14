cr.define('cr.view.createMember',function(){
    var inputTemplate = $.templates("#inputTmpl");

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
    
    //Should be called upon render.
    function initialize(){
        $("#inputs").html(inputTemplate.render(inputs));
        $('#expire_at').datepicker({
            format: 'yyyy/mm/dd',
        });
        $("#member_type").change(function(elem){
            var offset={
                year:0,
                month:0,
            }
            switch (elem.val()){
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
            dateObj.setYear(dateObj.getMonth()+offset.month);
            $('#expire_at').datepicker('setValue',dateObj);
        });
        $("#buttonSubmit").click(function(){
            var formObj = $("form").serializeObject()
        });
    }
    
    return{
        initialize: initialize,
    }
})


cr.view.creatMember.initialize();


