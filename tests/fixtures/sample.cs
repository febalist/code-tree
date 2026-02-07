namespace Geometry
{
    interface IDrawable
    {
        void Draw();
    }

    struct Point
    {
        public int X;
        public int Y;
    }

    enum Status
    {
        Active,
        Inactive
    }

    public class Shape : IDrawable
    {
        private string name;

        public Shape(string name)
        {
            this.name = name;
        }

        public void Draw()
        {
            Console.WriteLine($"Drawing {name}");
        }
    }
}
