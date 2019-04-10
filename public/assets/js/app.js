let username = null
let userId = null
let articleId;

$(document).ready(() => {

    if(localStorage["user"] ){
        signIn(localStorage.getItem("user"))
    }
    $('body').on('click', function(){
        if($(this).hasClass('disabled')){
            return;
        }
    })
    $('#user').on('click', () => {
        $('#user-modal').modal('show')

    })

    $('#submitUser').on('click', function() {
        let user = $('#username').val()
        signIn(user)
    })

    $('.comment').on('click', function() {
        articleId = $(this).data('id')
        $.ajax({
            type: 'GET',
            url: '/comments/' + articleId
        }).then(result =>{
            console.log(result)
            $('#comment-body').empty()
            let commentContent = result.notes
            if(commentContent.length > 0){
                commentContent.forEach(comment => {
                    populateComments(comment) 
                });

            }

            $('#comment-modal').attr('data-id', articleId).modal('show')
        })
    })

    $('#comment-body').on('click', '.delComment', function(){
        let commentId = $(this).data('id')
        $.ajax({
            type: 'DELETE',
            url: '/comments' + commentId,
            data: {articleId: articleId}
        }).then(result => {
            console.log(result)
            $('#comment-body').empty()
            let commentContent = result.notes
            if(commentContent.length > 0){
                commentContent.forEach(comment => {
                    populateComments(comment) 
                });
            }
        })
    })

    $('#submitComment').on('click', function(){
        event.preventDefault();
        let commentContent = $('#user-comment').val().trim()
        console.log(articleId)
        if(commentContent.length > 0 && userId !== null){
            $('#user-comment').val('')
            $.ajax({
                type: 'POST',
                url: '/comments/' + articleId,
                data: {
                        user: userId,
                        comment: commentContent
                    }
            }).then(result => {
                console.log(result)
                populateComments(result)
            })
        }
    })



    $('body').on('click', '.add-favorite', function(){
        event.preventDefault();
        if(username === null){
            $('#user-modal').modal('show')
        } else {
            articleId = $(this).data('id');
            let icon = $(this).children()
            toggleIcon(icon)
            let data = {
                userId: userId,
                articleId: articleId,
                delete: false
            }
            if($(this).hasClass('favorite')){
                data.delete = true;
            }
            console.log(articleId)
            $.ajax({
                type: 'POST',
                url: '/favorite',
                data: data
            }).then(result => {
                console.log(result)
            })
        }
    })

})

function toggleIcon(icon){
    if(icon.hasClass('far')){
        icon.removeClass('far')
        icon.addClass('fas')
    } else {
        icon.removeClass('fas')
        icon.addClass('far')
    }
}

function populateComments(comment){
    let commentRow = $('<tr>').attr('data-id', comment._id)
    let commentCell = $('<td>').html(comment.body).appendTo(commentRow)
    let delButton = $('<td>').html(
        `<button class='delComment' data-id='${comment._id}'>
            <i class='far fa-trash-alt'></i>
        </button>`)
        .attr('data-id', comment._id)
        .appendTo(commentRow)
    $('#comment-body').append(commentRow)
}

function findFavorites(articleIds){
    articleIds.forEach(article => {
        let favBtn = $(`a.add-favorite[data-id='${article}']`).addClass("favorite")
      let favIcon = favBtn.children()
        toggleIcon(favIcon)
    })
    
}

function signIn(user){
    $.ajax({
        type: 'GET',
        url: '/user/' + user
    })
    .then(result => {
        username = result.username
        userId = result._id
        favorites = result.articles;
        localStorage.setItem('user', username)
        $('#user').addClass('disabled')
        findFavorites(result.articles)
        $('#favorites').removeClass('disabled')
        if($('#favorites').hasClass("displayed")){
            $('#favorites').attr('href', '/')
            $('#favorites').removeClass("displayed")
        } else {
            $('#favorites').attr('href', `/favorites/${userId}`)
        }

        console.log(result)
    })
}