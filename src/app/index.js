import React from 'react';
import { render } from 'react-dom';

var Comida = React.createClass({
  getInitialState:function() {
    return {like:Boolean(this.props.like),editing:false}
  },
  handleLike:function() {
    this.setState({like:!this.state.like});
  },
  remove:function() {
    this.props.onRemove(this.props.index);
  },
  cancel: function() {
    this.setState({editing:false})
  },
  save: function() {
    this.props.onChange(this.refs.nuevoNombre.value, this.props.index);
    this.setState({editing:false});
  },
  showEditingView:function() {
    return(<div className="comida">
      <input ref="nuevoNombre" defaultValue={this.props.nombre}
      type="text" className="form-control" placeholder="Nuevo Nombre"/>
      <div className="glyphicon glyphicon-ok-circle blue" onClick={this.save}></div>
      <div className="glyphicon glyphicon-remove-circle red" onClick={this.cancel}></div>
    </div>);
  },
  edit:function() {
    this.setState({editing:true});
  },
  showFinalView:function() {
    return (<div className="comida">
      <h1 className="bg-success">{this.props.nombre}</h1>
      <p className="bg-info">
        Comida <i>{this.props.children}</i>
      </p>
      <div>
        <input type="checkbox" onChange={this.handleLike} defaultChecked={this.state.like}
        className="glyphicon glyphicon-heart glyphicon-heart-lg"></input>
          Like:{this.state.like.toString()}
      </div>
      <div>
        <div className="glyphicon glyphicon-trash red" onClick={this.remove}></div>
        <div className="glyphicon glyphicon-pencil blue" onClick={this.edit}></div>
      </div>
    </div>);
  },
  render:function() {
    if (this.state.editing) {
      return this.showEditingView();
    }else{
      return(this.showFinalView());
    }
  }
});

var ListaComida = React.createClass({
  getInitialState:function() {
    return {comidas:['Tacos','Paella','Ceviche']}
  },
  getDefaultProps:function() {
    return {
      framework:'React',
      tech:'Javascript'
    };
  },
  componentWillMount:function() {
    // alert('antes');
    var pais;
    var self = this;
    $.getJSON('https://restcountries.eu/rest/v1/all',function(data) {
      for (var pais in data) {
        console.log(pais,data[pais].name);
        self.add(data[pais].name);
      }
      $(self.refs.spinner).removeClass('glyphicon-refresh-animate');
      $(self.refs.spinner).hide();
    });
  },
  componentDidMount:function() {
    $(this.refs.spinner).addClass('glyphicon-refresh-animate');
  },
  add:function(comida) {
    var nuevaComida = this.refs.nuevaComida.value;
    if (nuevaComida == '') {
      if (typeof comida == 'undefined') {
        nuevaComida = 'Nueva Comida'
      }else{
        nuevaComida = comida;
      }
    }
    var arrComidas = this.state.comidas;
    arrComidas.push(nuevaComida);
    this.setState({comidas:arrComidas});
    this.refs.nuevaComida.value = '';
  },
  remove:function(i) {
    var arr = this.state.comidas;
    arr.splice(i,1);
    this.setState({comidas:arr});
  },
  update:function(nuevoNombre,i) {
    var arr = this.state.comidas;
    arr[i]=nuevoNombre;
    this.setState({comidas:arr});
  },
  eachItem:function(comida,i) {
    return(<Comida key={i}
      index={i}
      nombre={comida}
      onRemove={this.remove}
      onChange={this.update}>
      {i+1}
      </Comida>)
  },
  handleKeyDown:function(e) {
    if(e.charCode === 13){
      this.add();
    }
  },
  render:function() {
    return(
      <div className="centerBlock">
        <header>
          <h1>Mis Comidas Favoritas</h1>
          <i>Total : {this.state.comidas.length}</i>
          <br/>
          <span ref="spinner" className="glyphicon glyphicon-refresh"></span>
          <br/>
          <i>Hecho con {this.props.framework}, una Libreria de {this.props.tech}</i>
        </header>
        <div className="input-group">
          <input ref="nuevaComida" onKeyPress={this.handleKeyDown}
          type="text" className="form-control" placeholder="Agregar Comida"></input>
          <span className="input-group-btn">
            <div onClick={this.add.bind(null,"Nueva Comida")}
            className="btn btn-default btn-success">+</div>
          </span>
        </div>
        <div>
          {this.state.comidas.map(this.eachItem)}
        </div>
      </div>
    );
  }
});

render(<ListaComida/>,document.getElementById('app'));
