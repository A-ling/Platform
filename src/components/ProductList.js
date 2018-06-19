import React from 'react';
import PropTypes from 'prop-types';
import {Table, Popconfirm, Button} from 'antd';

const ProductList = ({onDelete,productsc}) =>{
	const columns = [
		{
			title:'姓名',
			dataIndex:'name',
			key:"name",
		},{
			title:'操作',
			render:(text,record)=>{
				return (
					<Popconfirm title="Delete?" onConfirm={()=>onDelete(record.id)}>
						<Button>删除</Button>
					</Popconfirm>
				);
			},
			key:"actions",
		},
	];

	return (
		<Table 
			dataSource={productsc}
			columns = {columns}
		/>

		);
};

//propTypes 
ProductList.propTypes ={
	onDelete:PropTypes.func.isRequired,
	productsc:PropTypes.array.isRequired,
}

export default ProductList;