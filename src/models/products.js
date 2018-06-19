export default{
	namespace:'products',
	state:[],
	reducers:{
		'delete' (state,{payload:id}){
			console.log(state);
			return state.filter(item => item.id !== id);
		},
	},
};