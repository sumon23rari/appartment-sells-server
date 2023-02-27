const express=require("express");
require('dotenv').config();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app=express();
const port=process.env.PORT || 8000;

// using middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpjacbz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const appartMents= client.db("appart");
        const services=appartMents.collection("propertis");
        const orderCollect=appartMents.collection('getOrder');
        // display all properits
        app.get('/services',async(req,res)=>{
            const query={};
            const cursor=services.find(query);
            const result=await cursor.toArray();
            res.send(result);
        });
        // display one propertis
        app.get('/services/:id',async(req,res)=>{
        const id =(req.params.id);
        console.log('id',id)
       // const value=JSON.stringify(id);
       const query={_id: new ObjectId(id)};
       const onserviced=await services.findOne(query);
       res.send(onserviced)
        });
        // app.get('/checkOut/:id',async(req,res)=>{
        //     const id =req.params.id;
        //     console.log('checkout',id);
        //     const query={_id:new ObjectId(id)};
        //     const checkd=await services.findOne(query);
        //     res.send(checkd)
        // })
        // app.get('/checkOut/:')
        //post one propertis
        app.post('/services',async(req,res)=>{
            const newService=req.body;
            const serviceResult=await services.insertOne(newService)
            res.send(serviceResult)
        })
        //post order properties
        app.post('/orders',async(req,res)=>{
            const newOrders=req.body;
            const orderResult=await orderCollect.insertOne(newOrders);
            res.send(orderResult)
        })
        // get order api
        app.get('/orders',async(req,res)=>{
            const email=req.query.email;
            console.log(email);
            const query={email:email}
            const cursor=orderCollect.find(query)
            const result =await cursor.toArray();
            res.send(result);
        });
      
        // delete one propertis
        app.delete('/services/:id',async(req,res)=>{
            const ids=req.params.id;
            const deleteItem= new ObjectId(ids);
            const query={_id:deleteItem}
            const deleteServiced=await services.deleteOne(query);
            res.send(deleteServiced);
        })
    }
    finally{
        //await client close().
    }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('running my crud server')
})
app.listen(port,()=>{
console.log('running server on port',port);
})