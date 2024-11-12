package com.fullstack.bookstore.config;

import com.fullstack.bookstore.entity.Book;
import com.fullstack.bookstore.entity.Message;
import com.fullstack.bookstore.entity.Review;
import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/books/secure/**", "/api/reviews/secure/**", "/api/messages/secure/**", "/api/admin/secure/**").authenticated()  // Only secure this endpoint
                        .anyRequest().permitAll()  // Allow all other requests
                )
                .cors(withDefaults())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
                .setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());
        Okta.configureResourceServer401ResponseBody(http);
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("https://localhost:3000", "http://localhost:8080"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", corsConfiguration);

        return new CorsFilter(source);
    }

    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {
        return RepositoryRestConfigurer.withConfig(repositoryRestConfiguration ->
                repositoryRestConfiguration.exposeIdsFor(Book.class, Review.class, Message.class)
        );
    }
}
