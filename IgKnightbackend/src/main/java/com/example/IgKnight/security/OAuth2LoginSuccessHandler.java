package com.example.IgKnight.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.IgKnight.entity.User;
import com.example.IgKnight.service.OAuth2UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final OAuth2UserService oAuth2UserService;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, OAuth2UserService oAuth2UserService) {
        this.jwtUtil = jwtUtil;
        this.oAuth2UserService = oAuth2UserService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Process OAuth2 user and get/create user in database
        User user = oAuth2UserService.processOAuth2User("google", oAuth2User);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        
        // Redirect to frontend with token
        String redirectUrl = String.format("http://localhost:5173/oauth2/redirect?token=%s&username=%s", 
                token, user.getUsername());
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
