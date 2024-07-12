using System.Runtime.CompilerServices;

public static class LoggerExtensions{


    public static void LogInformationWithMethod (this ILogger logger,string message,[CallerMemberName] string methodName=""){
        logger.LogInformationWithMethod($"{methodName}:{message}");
    }

    public static void LogWarningWithMethod(this ILogger logger,string message,[CallerMemberName] string methodName=""){
        logger.LogWarning($"{methodName}:{message}");
    }

    public static void LogErrorWithMethod(this ILogger logger,string message ,[CallerMemberName] string methodName=""){
        logger.LogError($"{methodName}:{message}");
    }
}