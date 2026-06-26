package com.healthcare.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import com.healthcare.entity.User;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String SECRET =
            "1234567890123456789012345678901234567890123456789012345678901234";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(User user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", user.getRole().name());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token){

        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token){

        return extractAllClaims(token)
                .getExpiration()
                .after(new Date());
    }

    private Claims extractAllClaims(String token){

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}