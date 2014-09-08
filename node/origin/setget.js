function Field(val){
	this.value=val;
}
Field.prototype={
	get oo(){
		return this.value+'oo';
	},
	set oo(val){
		this._value=val;
	}
}
var field=new Field('haha')
console.log(field.oo);
