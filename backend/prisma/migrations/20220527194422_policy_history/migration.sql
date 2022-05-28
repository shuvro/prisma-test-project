-- CreateTable
CREATE TABLE "PolicyHistory" (
    "id" UUID NOT NULL,
    "policyId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "status" "PolicyStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolicyHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PolicyHistory" ADD CONSTRAINT "PolicyHistory_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
