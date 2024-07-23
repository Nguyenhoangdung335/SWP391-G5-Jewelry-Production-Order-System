package com.swp391.JewelryProduction.config;

import com.swp391.JewelryProduction.enums.*;
import com.swp391.JewelryProduction.util.StringToEnum;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.format.FormatterRegistry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.util.Locale;

@Configuration
@EnableWebMvc
@EnableAsync
public class WebConfig implements WebMvcConfigurer {

    private final AsyncTaskExecutor taskExecutor;

    @Value("${url.fe}")
    private String feURL;

    public WebConfig(@Qualifier("asyncTaskExecutor") AsyncTaskExecutor taskExecutor) {
        this.taskExecutor = taskExecutor;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
    }

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();

        bean.setViewClass(JstlView.class);
        bean.setPrefix("/WEB-INF/view/");
        bean.setSuffix(".jsp");

        return bean;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToEnum<ReportType>(ReportType.class));
        registry.addConverter(new StringToEnum<AccountStatus>(AccountStatus.class));
        registry.addConverter(new StringToEnum<Gender>(Gender.class));
        registry.addConverter(new StringToEnum<OrderStatus>(OrderStatus.class));
        registry.addConverter(new StringToEnum<Role>(Role.class));
        registry.addConverter(new StringToEnum<WorkStatus>(WorkStatus.class));
    }

    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        configurer.setTaskExecutor(taskExecutor);
        configurer.setDefaultTimeout(5000);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NotNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("HEAD","GET","POST","PUT","DELETE","PATCH","OPTIONS");
            }
        };
    }
}
