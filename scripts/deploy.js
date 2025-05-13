async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Desplegando el contrato con la cuenta:", owner.address);

  const ParticipacionONG = await ethers.getContractFactory("ParticipacionONG");
  const contrato = await ParticipacionONG.deploy();
  console.log("Contrato desplegado en:", contrato.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
