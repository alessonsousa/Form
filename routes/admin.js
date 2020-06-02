
const express = require('express')
const reuter = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

reuter.get('/', function (req, res) {
    res.render('admin/index')
})

reuter.get('/posts', function (req, res) {
    res.send('Pagina de Posts')
})

reuter.get('/categorias', function (req, res) {
    Categoria.find().sort({date: 'desc'}).then(function(categorias){
        res.render("admin/categorias",{categorias: categorias})
    }).catch(function(err){
        req.flash('error_msg', 'Houve um erro ao lista as categorias')
        res.redirect('/admin')
    })
   
})

reuter.get('/categorias/add', function (req, res) {
    res.render('admin/addcategorias')
})

reuter.post('/categorias/nova', function (req, res) {

    var erros = []

    if (req.body.nome && typeof req.body.nome == undefined || req.body.nome == null) {
        error.push({
            texto: 'Nome invalido'
        })
    }
    if (req.body.slug && typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({
            texto: 'Slug invalido'
        })
    }
    if (req.body.nome.length < 2) {
        erros.push({
            texto: 'Nome muito pequeno'
        })
    }
    if (erros.length > 0) {
        res.render('admin/addcategorias', {
            erros: erros
        })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(function () {
            req.flash('success_msg', 'categoria criada com sucesso!!')
            res.redirect('/admin/categorias')

        }).catch(function (err) {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!')
            res.redirect('/admin')
        })
    }

})

reuter.get('/postagens', function(req, res){
    res.render('admin/postagens')
})

reuter.get('/postagens/add', function(req, res){
    Categoria.find().then(function(categorias){
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch(function(err){
        req.flash('Houve uma erro')
        res.redirect('/admin')
    })
    
})

reuter.post('/postagens/nova', function(req, res){
    var erros = []

    if(req.body.categoria == '0'){
        erros.push({texto: 'Categoria invalida!'})
    }
    if(erros.length > 0){
        res.render('admin/addpostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save(function(){
            req.fresh("success_msg", 'postagem criada com sucesso')
            res.redirect('/admin/postagens')
        }).catch(function(err){
            req.fresh('error_msg', 'erro durante o salvamento da postagem')
            res.redirect('/admin/postagens')
        })
    }
})

module.exports = reuter