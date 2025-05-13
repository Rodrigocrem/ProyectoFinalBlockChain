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
    constructor() ERC1155("https://rodrigocrem.github.io/ProyectoFinalBlockChain/{id}.json") Ownable(msg.sender) {
        nombresTokens[0] = "Taller educativo";
        nombresTokens[1] = "Jornada de limpieza";
        nombresTokens[2] = "Campana de reforestacion";
        nombresTokens[3] = "Coordinador de evento";
    }

    // Función para entregar certificados (solo el owner puede)
    function entregarCertificado(address to, uint256 id, uint256 cantidad) public onlyOwner {
        uint256 cantidadConDecimales = cantidad * 10**18; // Usamos 10^18 para manejar decimales
        _mint(to, id, cantidadConDecimales, "");
        emit TokenEntregado(to, id, cantidadConDecimales);
    }

    // Permitir actualizar el URI si se cambia el host de los metadatos
    function actualizarURI(string memory nuevaURI) public onlyOwner {
        _setURI(nuevaURI);
    }
}
