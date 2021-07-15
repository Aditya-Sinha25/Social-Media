//const queue =require('../config/kue');
//const commentsMailer =require('../mailer/comments_mailer');
//
//queue.process('emails',function(job,done){
//    console.log('Emails worker is processing a job',job.data);
//    commentsMailer.newComment(job.data);
//
//    done();
//});