import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';

const app = express();
const port = 4000;
const prisma = new PrismaClient();

// restrict this later to specified hosts only.
const allowedOrigins = ['*'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options))
app.use(express.json())

export enum InsuranceType {
  LIABILITY = 'LIABILITY',
  HOUSEHOLD = 'HOUSEHOLD',
  HEALTH = 'HEALTH'
}
export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DROPPED_OUT = 'DROPPED_OUT'
}

app.get('/policies', async (req, res) => {
  const { search, offset, limit, sortField, sortDirection } = req.query;

  const skip = offset ? Number(offset) : 0
  const take = limit ? Number(limit) : 10
  const or: Prisma.PolicyWhereInput = search
    ? {
      OR: [
        { provider: { contains: search as string, mode: 'insensitive' } },
        { customer: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search as string, mode: 'insensitive' } } }
      ],
    }
    : {};

  let orderBy = {}
  if(sortField) {
    orderBy = {
      [sortField as string] : sortDirection && sortDirection as string in ['asc', 'desc'] ? sortDirection as string : 'desc' 
    }
  } 

  const policies = await prisma.policy.findMany({
    skip: skip as number,
    take: take as number,
    where: {
      ...or,
    },
    select: {
      id: true,
      provider: true,
      insuranceType: true,
      status: true,
      startDate: true,
      endDate: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true
        }
      }
    },
    orderBy: orderBy
  })

  res.json(policies);
})

const createCustomerAndPolicy = (
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  provider: string,
  insuranceType: InsuranceType,
  startDate: Date,
) => {
  return Prisma.validator<Prisma.PolicyCreateInput>()({
    customer: {
      create: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth
      }
    },
    provider: provider,
    insuranceType: insuranceType,
    status: 'PENDING',
    startDate: startDate
  })
}

app.post('/policy', async (req, res) => {
  const body = req.body
  await prisma.policy.create({
    data: createCustomerAndPolicy(
      body.firstName,
      body.lastName,
      new Date(body.dateOfBirth),
      body.provider,
      body.insuranceType,
      new Date(body.startDate)
    )
  })
  res.json({success: true, message: 'Policy created successfully'})
});

const updateCustomerAndPolicy = (
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  provider: string,
  insuranceType: InsuranceType,
  startDate: Date,
  status: PolicyStatus
) => {
  return Prisma.validator<Prisma.PolicyUpdateInput>()({
    customer: {
      update: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth
      }
    },
    provider: provider,
    insuranceType: insuranceType,
    status: status,
    startDate: startDate
  })
}

app.put('/policy/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body
  const policyExist = await prisma.policy.findFirst({
    where: {
      id: id
    },
    select: {
      id: true,
      provider: true,
      insuranceType: true,
      status: true,
      startDate: true,
      endDate: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true
        }
      }
    }
  });
  if (policyExist) {
    await prisma.policyHistory.create({
      data: {
        policyId: policyExist.id,
        provider: policyExist.provider,
        insuranceType: policyExist.insuranceType,
        status: policyExist.status,
        startDate: policyExist.startDate,
        endDate: policyExist.endDate
      }
    })
    const policy = await prisma.policy.update({
      where: {id : id},
      data: updateCustomerAndPolicy(
        body.firstName ?? policyExist.customer.firstName,
        body.lastName ?? policyExist.customer.lastName,
        new Date(body.dateOfBirth ?? policyExist.customer.dateOfBirth),
        body.provider ?? policyExist.provider,
        body.insuranceType ?? policyExist.insuranceType,
        new Date(body.startDate ?? policyExist.startDate),
        body.status ?? policyExist.status
      )
    })
    res.json({success: true, message:"Policy updated successfully"})
  }
});

app.get('/policy-history',async (req, res) => {
  const {offset, limit} = req.query
  const skip = offset ? Number(offset) : 0
  const take = limit ? Number(limit) : 10
  const histories = await prisma.policyHistory.findMany({
    skip: skip as number,
    take: take as number,
    select: {
      id: true,
      provider: true,
      insuranceType: true,
      status: true,
      startDate: true,
      endDate: true,
      policy: {
        select: {
          id: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  res.json(histories)
})

app.get('/', (req, res) => {
  res.send('Server is up and running 🚀')
})

app.listen(port, () => {
  console.log(`🚀  Server ready at ${port}`);
});
