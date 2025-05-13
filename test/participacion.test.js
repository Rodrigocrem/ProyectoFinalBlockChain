const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ParticipacionONG Contract", function () {
  let ParticipacionONG;
  let contrato;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ParticipacionONGFactory = await ethers.getContractFactory("ParticipacionONG");
    contrato = await ParticipacionONGFactory.deploy();
    await contrato.deployed();
  });

  it("Debería mintear un token correctamente", async function () {
    const tokenId = 0; // ID del "Taller educativo"
    const cantidad = 1;

    await contrato.entregarCertificado(addr1.address, tokenId, cantidad);

    const balance = await contrato.balanceOf(addr1.address, tokenId);
    expect(balance).to.equal(cantidad * 10 ** 18);
  });

  it("Debería permitir que el propietario actualice el URI", async function () {
    const nuevoURI = "https://nuevo.uri/{id}.json";

    await contrato.actualizarURI(nuevoURI);

    const uri = await contrato.uri(0);
    expect(uri).to.equal(nuevoURI);
  });

  it("No debería permitir que una persona que no sea el propietario mintee un token", async function () {
    const tokenId = 0;
    const cantidad = 1;

    await expect(
      contrato.connect(addr1).entregarCertificado(addr1.address, tokenId, cantidad)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
