package com.AgreTrade.AgreTrade.controller;

import com.AgreTrade.AgreTrade.dto.AuthResponse;
import com.AgreTrade.AgreTrade.dto.LoginRequest;
import com.AgreTrade.AgreTrade.dto.RegisterRequest;
import com.AgreTrade.AgreTrade.entity.Role;
import com.AgreTrade.AgreTrade.entity.User;
import com.AgreTrade.AgreTrade.repository.RoleRepository;
import com.AgreTrade.AgreTrade.repository.UserRepository;
import com.AgreTrade.AgreTrade.repository.FarmerRepository;
import com.AgreTrade.AgreTrade.repository.MerchantRepository;
import com.AgreTrade.AgreTrade.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Username is already taken!");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Email is already in use!");
            }

            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            // Assign default role
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ROLE_USER");
                        return roleRepository.save(newRole);
                    });
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(null, user.getUsername(), "User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Register admin user (for testing/development purposes)
     * In production, this should be removed or protected
     */
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Username is already taken!");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Email is already in use!");
            }

            // Create new admin user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            // Assign ADMIN role
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ROLE_ADMIN");
                        return roleRepository.save(newRole);
                    });
            roles.add(adminRole);
            user.setRoles(roles);

            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(null, user.getUsername(), "Admin user registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Validate role parameter
            String role = loginRequest.getRole();
            if (role != null && !role.isEmpty()) {
                // Check if user exists in the correct table for the specified role
                if ("farmer".equalsIgnoreCase(role)) {
                    boolean isFarmer = farmerRepository.findByEmail(loginRequest.getUsername()).isPresent();
                    if (!isFarmer) {
                        // Check if they're registered as merchant
                        boolean isMerchant = merchantRepository.findByEmail(loginRequest.getUsername()).isPresent();
                        if (isMerchant) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(new AuthResponse(null, null, "This email is registered as a Merchant. Please login as Merchant."));
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(new AuthResponse(null, null, "Invalid email or password. Please try again."));
                        }
                    }
                } else if ("merchant".equalsIgnoreCase(role)) {
                    boolean isMerchant = merchantRepository.findByEmail(loginRequest.getUsername()).isPresent();
                    if (!isMerchant) {
                        // Check if they're registered as farmer
                        boolean isFarmer = farmerRepository.findByEmail(loginRequest.getUsername()).isPresent();
                        if (isFarmer) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(new AuthResponse(null, null, "This email is registered as a Farmer. Please login as Farmer."));
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(new AuthResponse(null, null, "Invalid email or password. Please try again."));
                        }
                    }
                }
            }

            // Authenticate user (CustomUserDetailsService will accept email or username)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(loginRequest.getUsername());

            return ResponseEntity.ok(new AuthResponse(token, loginRequest.getUsername(), "Login successful!"));
        } catch (AuthenticationException e) {
            // Return proper error response for invalid credentials
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, "Invalid email or password. Please try again."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse(null, null, "Login failed: " + e.getMessage()));
        }
    }

    /**
     * Get user roles
     */
    @GetMapping("/roles")
    public ResponseEntity<?> getUserRoles(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String username = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByUsername(username)
                    .or(() -> userRepository.findByEmail(username))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Set<String> roleNames = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(java.util.stream.Collectors.toSet());
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("roles", roleNames);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching roles: " + e.getMessage());
        }
    }
}
