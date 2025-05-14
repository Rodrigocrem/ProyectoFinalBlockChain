// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParticipacionONG is ERC1155, Ownable {

    // Mapping para registrar nombres legibles de los tipos de participación
    mapping(uint256 => string) public nombresTokens;

    // Evento para seguimiento
    event TokenEntregado(address indexed to, uint256 id, uint256 cantidad);

    // Constructor con definición del owner y URI base
    constructor() ERC1155("https://rodrigocrem.github.io/ProyectoFinalBlockChain/{id}.json") Ownable() {
        nombresTokens[0] = "Taller educativo";
        nombresTokens[1] = "Jornada de limpieza";
        nombresTokens[2] = "Campana de reforestacion";
        nombresTokens[3] = "Coordinador de evento";
    }

    // Función para entregar certificados (solo el owner puede)
    function entregarCertificado(address to, uint256 id, uint256 cantidad) public onlyOwner {
        _mint(to, id, cantidad, "");  // Mint sin fraccionamiento, se usan enteros
        emit TokenEntregado(to, id, cantidad);
    }

    // Permitir actualizar el URI si se cambia el host de los metadatos
    function actualizarURI(string memory nuevaURI) public onlyOwner {
        _setURI(nuevaURI);
    }

    // Nueva función para obtener el nombre del token basado en el ID
    function getTokenName(uint256 id) public view returns (string memory) {
        return nombresTokens[id];
    }
}
