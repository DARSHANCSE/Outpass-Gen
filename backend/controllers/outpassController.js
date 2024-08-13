import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


const getOutpass = async(req,res)=>{
    const {startDate,endDate,outTime,inTime,reason,hostelBlock} = req.body;
    console.log(req.headers.id);
    try{
        const student = await prisma.student.findUnique({
            where:{
                id:req.headers.id
            },select:{
                staff1:{
                    select:{
                        id:true
                    }
                },
                staff2:{
                    select:{
                        id:true
                    }
                },
                hod:{
                    select:{
                        id:true,
                    }
                }
            }
        })
        const newOutPass = await prisma.outpass.create({
            data:{
                rollNo:req.headers.id,
                startDate:startDate,
                endDate:endDate,
                outTime:outTime,
                inTime:inTime,
                reason,
                hostelBlock,
            }
        })
        const newStaffRequest = await prisma.staffRequests.create({
            data:{
                staffId1:student.staff1.id,
                staffId2:student.staff2.id,
                outpassId:newOutPass.id
            }
        })
        const newHodRequest = await prisma.hODRequests.create({
            data:{
                hodId:student.hod.id,
                outpassId:newOutPass.id
            }
        })
        res.json({success:true,outpass:newOutPass,staffRequest:newStaffRequest,hodRequest:newHodRequest})
    }catch(err){
        console.log(err);
        res.json({success:false,message:err})
    }
}

const gethodrequest=async (req,res)=>{
    const hdid= req.headers.id
    try{
        const req= await prisma.HODRequests.findUnique(
            {
                where:{
                    hodid:hdid
                }
            ,select:{
                outpassid:true
            }}
        )
        let allreqs=[];
        for (const x of req){
            const studentreq = await prisma.Outpass.findUnique({
                where:{
                    id:x.outpassid
                },
                select:{
                    rollNo:true,
                    student:{
                        select:{
                        name:true,
                        class:true,
                        year:true,
                        department:true
                        }}
                },
                startDate:true,
                endDate:true,
                outTime:true,
                inTime:true,
                reason:true,
                hostelBlock:true


            })
            
        allreqs.push(studentreq)
        }
        
        res.json({success:true,message:allreqs})
    }
    catch(err){
        res.json({success:true,message:"error"})
    }
}

const getStaffRequests = async(req,res)=>{
    const staffId = req.headers.id;
    try{
        const requests = await prisma.staffRequests.findMany({
            where:{
                OR:[
                    {staffId1:staffId},
                    {staffId2:staffId}
                ]
            },select:{
                outpassId:true
            }
        })
        let allrequests = [];
        for (const x of requests){
            console.log(x)
            const studentRequest = await prisma.outpass.findUnique({
                where:{
                    id : x.outpassId
                },select:{
                    id:true,
                    rollNo:true,
                    student:{
                        select:{
                            name:true,
                            class:true,
                            year:true,
                            department:true,
                        }
                    },
                    startDate:true,
                    endDate:true,
                    outTime:true,
                    inTime:true,
                    reason:true,
                    hostelBlock:true
                }
            })
            allrequests.push(studentRequest)
        }
        res.json({success:true,data:allrequests})
    }catch(err){
        console.log(err);
        res.json({success:false,message:err})
    }
}

const editOd = async(req,res) =>{
    const {odId,startDate,endDate,outTime,inTime} = req.body;
    try{
        const updatedOutpass = await prisma.outpass.update({
            where:{
                id:odId
            },data:{
                startDate:startDate,
                endDate:endDate,
                outTime:outTime,
                inTime:inTime
            }
        })
        res.json({success:true,data:updatedOutpass})
    }catch(err){
        console.log(err);
        res.json({success:false,data:err})
    }
}




export {gethodrequest,getOutpass,getStaffRequests}