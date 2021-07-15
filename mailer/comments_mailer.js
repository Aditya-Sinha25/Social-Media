const nodeMailer =require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment)=>{
    let htmlString =nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    console.log('inside newComment Mailer');

    nodeMailer.transporter.sendMail({
        from:'adityagodofgamer.1@gmail.com',
        to:comment.user.email,
        subject:"New comment published!",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message Sent',info);
        return;
    });
}