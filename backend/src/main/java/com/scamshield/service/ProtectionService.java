package com.scamshield.service;

import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ProtectionResponseDTO;

public interface ProtectionService {

    ProtectionResponseDTO generate(ProtectionRequestDTO request);
}
