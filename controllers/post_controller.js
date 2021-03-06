const Post =require('../models/post');
const Comment =require('../models/comment');

module.exports.create=async function(req,res){
    try{
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        
        post.populate('user',function(err){
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post:post
                    },
                    message:"Post-created!"
                });
            }
            req.flash('success','Post Published');
            return res.redirect('back');
        });
        

    }catch(err){
        req.flash('error',err);
        return;
    }
}

module.exports.destroy=async function(req,res){
    try{
        let post=await Post.findById(req.params.id);
        if(post.user==req.user.id){
            post.remove();
            await Comment.deleteMany({
                post:req.params.id
            });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:'Post Deleted Successfully'
                });
            }

            req.flash('success','Post deleted');
            return res.redirect('back');
        }else{
            req.flash('success','Post Deleted');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        return;
    }
}